// Ref: https://github.com/bmf-san/goblin

function Router() {
  this.node = new Node({ label: "/" });
  this.add = (path, stuff) => {
    this.node.insert(path, stuff)
  };
  this.match = (path) => {
    return this.node.search(path)
  };
}

function Node({ label, stuff, children } = {}) {
  this.stuff = stuff || {};
  this.children = children || [];
  this.label = label || "";

  this.insert = (path, stuff) => {
    let curNode = this
    if (path == '/') {
      curNode.label = path
      curNode.stuff = stuff
    }
    const ps = this.splitPath(path)
    for (p of ps) {
      let nextNode = curNode.children[p]
      if (nextNode) {
        curNode = nextNode
      } else {
        curNode.children[p] = new Node({ label: p, stuff: stuff, children: [] })
        curNode = curNode.children[p]
      }
    }
  };

  this.splitPath = (path) => {
    const ps = []
    for (p of path.split('/')) {
      if (p) {
        ps.push(p)
      }
    }
    return ps
  };

  this.getPattern = (label) => {
    // :id{[0-9]+}  → [0-9]+$
    // :id          → (.+)
    const match = label.match(/^\:.+?\{(.+)\}$/)
    if (match) {
      return '(' + match[1] + ')'
    }
    return '(.+)'
  };

  this.getParamName = (label) => {
    const match = label.match(/^\:([^\{\}]+)/)
    if (match) {
      return match[1]
    }
  };

  this.noRoute = () => {
    return null
  };

  this.search = (path) => {

    let curNode = this
    const params = {}

    for (p of this.splitPath(path)) {
      const nextNode = curNode.children[p]
      if (nextNode) {
        curNode = nextNode
        continue
      }
      if (Object.keys(curNode.children).length == 0) {
        if (curNode.label != p) {
          return this.noRoute()
        }
        break
      }
      let isParamMatch = false
      for (const key in curNode.children) {
        if (key.match(/^:/)) {
          const pattern = this.getPattern(key)
          const match = p.match(new RegExp(pattern))
          if (match) {
            const k = this.getParamName(key)
            params[k] = match[0]
            curNode = curNode.children[key]
            isParamMatch = true
            break
          }
          return this.noRoute()
        }
      }
      if (isParamMatch == false) {
        return this.noRoute()
      }
    }
    return [curNode.stuff, params]
  }
}

module.exports = Router;

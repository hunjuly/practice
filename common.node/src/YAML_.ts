import * as yaml from 'yaml'
import { Node, Merge, Pair, YAMLMap, YAMLSeq, Alias, Scalar } from 'yaml/types'

// hyperledger fabric 때문에 만들었다. 앞으로 사용할 일이 있을까?
export class YAML {
    private doc: yaml.Document
    private anchors: yaml.Document.Anchors

    public static generate(value: SafeObj): string {
        const doc = new YAML()

        return doc.generate(value)
    }

    private generate(value: SafeObj): string {
        const node = this.getNode(value)

        this.doc.contents = node

        return this.doc.toString()
    }

    private constructor() {
        this.doc = new yaml.Document()
        this.anchors = this.doc.anchors
    }

    private aliasNode(name: string): Alias {
        const node = this.anchors.getNode(name) as Node

        return this.anchors.createAlias(node)
    }

    private mergeNode(name: string): Merge {
        const node = this.anchors.getNode(name) as Node

        return this.anchors.createMergePair(node)
    }

    private getNode(value: SafeObj): Node {
        if (value instanceof Array) {
            const node = new YAMLSeq()
            const entries = value as unknown[]

            for (const entry of entries) {
                let nodeVal = Node.prototype

                if (typeof entry === 'string' && entry.charAt(0) === '*') {
                    const name = entry.slice(1)

                    nodeVal = this.aliasNode(name)
                } else {
                    nodeVal = this.getNode(entry as SafeObj)
                }

                node.add(nodeVal)
            }

            return node
        } else if (typeof value === 'object') {
            const node = new YAMLMap()
            const entries = Object.entries(value)

            for (const entry of entries) {
                const key = entry[0]
                const val = entry[1]

                if (key.charAt(0) === '&') {
                    const name = key.slice(1)
                    const valNode = this.getNode(val as SafeObj)
                    this.anchors.setAnchor(valNode, name)

                    return valNode
                }

                let nodeVal = Node.prototype

                if (key === '<merge>') {
                    nodeVal = this.mergeNode(val as string)
                } else if (typeof val === 'string' && val.charAt(0) === '*') {
                    const name = val.slice(1)
                    const alias = this.aliasNode(name)

                    nodeVal = new Pair(key, alias)
                } else {
                    const valNode = this.getNode(val as SafeObj)
                    nodeVal = new Pair(key, valNode)
                }

                node.add(nodeVal)
            }

            return node
        }

        const node = new Scalar(value)

        return node
    }
}

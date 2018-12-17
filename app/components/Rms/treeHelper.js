import React from 'react';

class treeHelper {
    constructor(titleComponent, treeType, showComponentWithoutRelations = false) {
        this.titleComponent = titleComponent;
        this.treeType = treeType;
        this.showComponentWithoutRelations = showComponentWithoutRelations;
    }

    static searchTree(root, id, pathResult = []) {
        const stack = [];
        let node;
        let ii;
        stack.push(root);

        while (stack.length > 0) {
            node = stack.pop();
            if (node.componentId === id) {
                // Found it!
                return node;
            // eslint-disable-next-line no-else-return
            } else if (node.children && node.children.length) {
                for (ii = 0; ii < node.children.length; ii += 1) {
                    pathResult.push(ii);
                    stack.push(node.children[ii]);
                }
            }
        }

        // Didn't find it. Return null.
        return node;
    }

    componentToNode(component, item) {
        const Title = this.titleComponent;
        return {
            ...component,
            title: (
                <Title
                    color={component.color}
                    name={component.name}
                />
            ),
            type: this.treeType,
            expanded: item && !!item.expanded,
        };
    }

    walk(components, item, usedComponentsIds) {
        let component;
        if (item.componentId !== 'backlog') {
            component = components.find(comp => comp.id === item.componentId);
        } else {
            component = {
                id: item.componentId,
                name: item.componentId,
                expanded: item.expanded,
            };
        }
        if (component === undefined) {
            return null;
        }

        usedComponentsIds.push(component.id);
        const node = this.componentToNode(component, item);
        if (item.children !== undefined) {
            node.children = item.children.map((child) => {
                return this.walk(components, child, usedComponentsIds);
            }).filter(child => child !== null);
        }

        return node;
    }

    walkBack(components, item) {
        const { id: componentId, children, expanded } = item;
        let component;
        if (componentId !== 'backlog') {
            component = components.find(comp => comp.id === componentId);
        } else {
            component = {
                id: componentId,
                name: componentId,
            };
        }
        if (component === undefined) {
            return null;
        }
        const node = {
            componentId,
            expanded,
            children: [],
        };
        if (children !== undefined) {
            node.children = children.map((child) => {
                return this.walkBack(components, child);
            }).filter(child => child !== null);
        }

        return node;
    }

    listToTree(components, relations) {
        const roots = [];
        const usedComponentsIds = [];
        relations.forEach((root) => {
            const node = this.walk(components, root, usedComponentsIds);
            if (node !== null) {
                roots.push(node);
            }
        });
        if (this.showComponentWithoutRelations) {
            const unusedComponents = components
                .filter(comp => !usedComponentsIds.includes(comp.id));
            if (unusedComponents.length) {
                const idx = relations.findIndex(rel => rel.componentId === 'backlog');
                if (idx === -1) {
                    roots.push({
                        title: (
                            <this.titleComponent name="backlog" />
                        ),
                        id: 'backlog',
                        children: unusedComponents.map(comp => this.componentToNode(comp)),
                    });
                } else {
                    unusedComponents.forEach((comp) => {
                        roots[idx].children.push(this.componentToNode(comp));
                    });
                }
            }
        }
        return roots;
    }

    treeToRelations(components, data) {
        const roots = [];
        data.forEach((root) => {
            const node = this.walkBack(components, root);
            if (node !== null) {
                roots.push(node);
            }
        });
        return roots;
    }
}

export default treeHelper;

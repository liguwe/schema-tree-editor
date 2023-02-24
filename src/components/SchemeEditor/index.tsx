import {
    computed,
    defineComponent,
    defineEmits,
    defineProps,
    reactive,
    Ref,
    ref,
    UnwrapRef,
    onMounted,
    onUnmounted
} from 'vue';
import './index.less';
import Editable from './Editable.vue';
import {
    DownOutlined,
    RightOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
import Actions from "@/components/SchemeEditor/Actions.vue";
import ExtraActions from "@/components/SchemeEditor/ExtraActions.vue";
import SettingPropsModal from './SettingPropsModal.vue';
import DataTypeLink from './DataTypeLink.vue';
import {computePosition, autoPlacement} from '@floating-ui/dom';
// @ts-ignore
import vClickOutside from 'v-click-outside'

const {bind, unbind} = vClickOutside.directive

function isLeafNode(type: string) {
    return ['string', 'boolean', 'integer', 'number'].includes(type)
}

function isObject(type: string) {
    return type === 'object';
}

export default defineComponent({
    name: 'SchemeEditor',

    setup() {
        const data = reactive({
            "type": "object",
            // 额外的视图属性，仅有type为 "object" 有该属性
            "extraViewInfo": {
                "isExpand": true,
                "isRoot": true,
                "name": "root",
                "depth": 1,
            },
            "required": [
                "name"
            ],
            "properties": {
                "name": {
                    "type": "string",
                    "extraViewInfo": {
                        "depth": 2,
                    },
                },
                // "address": {
                //     "$ref": "#/components/schemas/Address"
                // },
                "age": {
                    "type": "integer",
                    "format": "int32",
                    "minimum": 0,
                    "extraViewInfo": {
                        "depth": 2,
                    },
                },
                'obj1': {
                    "type": "object",
                    "extraViewInfo": {
                        "isExpand": true,
                        "isRoot": false,
                        "name": "obj1",
                        "depth": 2,
                    },
                    "required": [
                        "name"
                    ],
                    "properties": {
                        "name1": {
                            "type": "string",
                            "extraViewInfo": {
                                "depth": 3,
                            },
                        },
                        "age1": {
                            "type": "integer",
                            "format": "int32",
                            "minimum": 0,
                            "extraViewInfo": {
                                "depth": 3,
                            },
                        },
                        'obj2': {
                            "type": "object",
                            "extraViewInfo": {
                                "isExpand": true,
                                "isRoot": false,
                                "name": "obj2",
                                "depth": 3,
                            },
                            "required": [
                                "name11"
                            ],
                            "properties": {
                                "name3232": {
                                    "type": "string",
                                    "extraViewInfo": {
                                        "depth": 4,
                                    },
                                },
                                // "address": {
                                //     "$ref": "#/components/schemas/Address"
                                // },
                                "age3333": {
                                    "type": "integer",
                                    "format": "int32",
                                    "minimum": 0,
                                    "extraViewInfo": {
                                        "depth": 4,
                                    },
                                },
                                'obj4341': {
                                    "type": "object",
                                    "extraViewInfo": {
                                        "isExpand": true,
                                        "isRoot": false,
                                        "name": 'obj4341',
                                        "depth": 4,
                                    },
                                    "required": [
                                        "name"
                                    ],
                                    "properties": {
                                        "name1332323": {
                                            "type": "string",
                                            "extraViewInfo": {
                                                "depth": 5,
                                            },
                                        },
                                        "age22221": {
                                            "type": "integer",
                                            "format": "int32",
                                            "minimum": 0,
                                            "extraViewInfo": {
                                                "depth": 5,
                                            },
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const expandIt = (tree: any, e: any) => {
            if (tree?.extraViewInfo) {
                tree.extraViewInfo.isExpand = !tree.extraViewInfo.isExpand;
            }
        }
        const visible = ref(false);

        const addProps = (tree: any, e: any) => {

        }
        const moveUp = (keyIndex: any, parent: any) => {
            const keys = Object.keys(parent.properties);
            // 互换两个元素的位置
            [keys[keyIndex - 1], keys[keyIndex]] = [keys[keyIndex], keys[keyIndex - 1]];
            let newObj: any = {};
            keys.forEach((item) => {
                newObj[item] = parent.properties[item];
            })
            parent.properties = {...newObj};
        };

        const moveDown = (keyIndex: any, parent: any) => {
            const keys = Object.keys(parent.properties);
            // 互换两个元素的位置
            [keys[keyIndex + 1], keys[keyIndex]] = [keys[keyIndex], keys[keyIndex + 1]];
            let newObj: any = {};
            keys.forEach((item) => {
                newObj[item] = parent.properties[item];
            })
            parent.properties = {...newObj};
        };


        const copy = (keyIndex: any, parent: any) => {
            const keys = Object.keys(parent.properties);
            const key = keys[keyIndex];
            const copyObj = JSON.parse(JSON.stringify(parent.properties[key]));
            keys.splice(keyIndex + 1, 0, `${key}-copy`);
            let newObj: any = {};
            keys.forEach((item) => {
                if (parent.properties[item]) {
                    newObj[item] = parent.properties[item];
                } else {
                    newObj[item] = copyObj;
                }
            })
            parent.properties = {...newObj};
        }

        const setRequire = (keyIndex: any, parent: any) => {
            const keys = Object.keys(parent.properties);
            const key = keys[keyIndex];
            if (!parent.required.includes(key)) {
                parent.required.push(key);
            }
        };
        const addDesc = (keyIndex: any, parent: any) => {
            const keys = Object.keys(parent.properties);
            const key = keys[keyIndex];
            // ::::todo 添加描述逻辑
        };

        const del = (keyIndex: any, parent: any) => {
            const keys = Object.keys(parent.properties);
            keys.splice(keyIndex, 1);
            let newObj: any = {};
            keys.forEach((item) => {
                newObj[item] = parent.properties[item];
            })
            parent.properties = {...newObj};
        };

        function handleModalOk() {
            visible.value = false;
        }

        function handleModalCancel() {
            visible.value = false;
        }

        const floatingCon: any = ref(null);
        const floating: any = ref(null);
        const showSettingPropsModal = (tree: any, e: any) => {
            visible.value = true;
            computePosition(e.target, floating.value, {
                placement: 'bottom-start', // 'bottom' by default
                middleware: [autoPlacement({
                    // top-start, right-start, bottom-start, left-start
                    // alignment: 'right',
                    // autoAlignment: false,

                })],
            }).then(({x, y}) => {
                Object.assign(floating.value.style, {
                    left: `${8 + x}px`,
                    top: `${y}px`,
                });
            });
        };

        onMounted(() => {
            // 添加点击事件监听器
            document.addEventListener('click', (event) => {
                // 如果单击事件不是发生在目标元素或其后代元素上
                // visible.value = floatingCon?.value.contains(event.target);
                if(event?.target?.className?.includes('setDataTypeAction')){
                    return;
                }
                console.log(floatingCon?.value,event.target)
                if(!floatingCon?.value?.contains(event.target)){
                    visible.value = false;
                }
            });
        })
        onUnmounted(() => {
            // unbind(floating.value, { value: onClickOutside });
        })




        const renderTree = (tree: any, option: any) => {
            const {keyIndex, parent, isFirst, isLast, keyName} = option;
            if (isObject(tree.type)) {
                const {isRoot, isExpand, depth} = tree?.extraViewInfo || {};
                return <div class={{'directoryNode': true, "rootNode": isRoot}}>
                    <div class={'directoryText'}
                         style={{'paddingLeft': `${depth * 30}px`}}>
                        {!isRoot ?
                            <div class={'horizontalLine'} style={{left: `${(depth - 1) * 30 + 8}px`}}></div> : null}
                        <div class={'baseInfo'}>
                            {isExpand ?
                                <DownOutlined onClick={expandIt.bind(this, tree)} class={'expandIcon'}/> : null}
                            {!isExpand ?
                                <RightOutlined onClick={expandIt.bind(this, tree)} class={'expandIcon'}/> : null}

                            {/*{!isRoot ? <Editable value={name}/> : null}*/}
                            {!isRoot ? <span>{keyName}</span> : null}
                            {!isRoot ? <span class={'baseInfoSpace'}>:</span> : null}
                            <a href="javascript:void(0)"
                               onClick={showSettingPropsModal.bind(this, tree)}
                               class={[tree.type, 'setDataTypeAction']}
                            >{tree.type}</a>
                            <span class={'baseInfoSpace'}>{`{${Object.keys(tree.properties).length}}`}</span>
                            <PlusOutlined onClick={addProps.bind(this, tree)} class={'addIcon'}/>
                        </div>
                        <div class={'action'}>
                            <Actions
                                isRoot={isRoot}
                                isFirst={isFirst}
                                isLast={isLast}
                                onMoveDown={moveDown.bind(this, keyIndex, parent)}
                                onMoveUp={moveUp.bind(this, keyIndex, parent)}
                                onCopy={copy.bind(this, keyIndex, parent)}/>
                        </div>
                        <div class={'extraAction'}>
                            <ExtraActions
                                isRoot={isRoot}
                                onAddDesc={addDesc.bind(this, keyIndex, parent)}
                                onDel={del.bind(this, keyIndex, parent)}
                                onSetRequire={setRequire.bind(this, keyIndex, parent)}/>
                        </div>
                    </div>
                    <div class={{
                        'directoryContainer': tree,
                        'directoryContainerExpand': isExpand,
                        'directoryContainerFold': !isExpand
                    }}>
                        {
                            Object.entries(tree.properties).map(([key, value]: any, index: number, arr: any) => {
                                const isFirst = index === 0;
                                const isLast = index === arr.length - 1;
                                const depth = value.extraViewInfo.depth;
                                if (isObject(value.type)) {
                                    return renderTree(value, {
                                        keyName: key,
                                        keyIndex: index,
                                        tree: true,
                                        parent: tree,
                                        isFirst: isFirst,
                                        isLast: isLast,
                                    });
                                } else {
                                    return (<div
                                        key={index}
                                        class={'leafNode'} style={{'paddingLeft': `${depth * 30}px`}}>
                                        <div class={'leafNodeHorizontalLine'}
                                             style={{left: `${(depth - 1) * 30 + 8}px`}}/>
                                        <div class={'baseInfo'}>
                                            {/*<Editable value={key}/>*/}
                                            <span>{key}</span>
                                            <span class={'baseInfoSpace'}>:</span>
                                            <a class={[value.type, 'setDataTypeAction']}
                                               onClick={showSettingPropsModal.bind(this, value)}
                                               href='javascript:void(0)'>{value.type}</a>
                                        </div>
                                        <div class={'action'}>
                                            <Actions
                                                isFirst={isFirst}
                                                isLast={isLast}
                                                isRoot={isRoot}
                                                onMoveDown={moveDown.bind(this, index, tree)}
                                                onCopy={copy.bind(this, index, tree)}
                                                onMoveUp={moveUp.bind(this, index, tree)}/>
                                        </div>
                                        <div class={'extraAction'}>
                                            <ExtraActions
                                                isRoot={false}
                                                onAddDesc={addDesc.bind(this, index, tree)}
                                                onDel={del.bind(this, index, tree)}
                                                onSetRequire={setRequire.bind(this, index, tree)}/>
                                        </div>
                                    </div>)
                                }
                            })
                        }
                    </div>
                    <div class={'verticalLine'} style={{left: `${depth * 30 + 8}px`}}></div>
                </div>
            }
        }


        // const directives = [
        //     { name: 'v-if', value: false, modifiers: { abc: true } }
        // ]
        return () => (
            <div class={'content'}>
                {renderTree(data, {})}
                <div ref={floatingCon}>
                    <div
                        class={'floatingSetting'}
                        ref={floating}
                        style={{
                            position: 'fixed',
                            display: visible.value ? 'block' : 'none',
                        }}
                    >
                        <a-card title={null}>
                            <SettingPropsModal
                                onOk={handleModalOk}
                                onCancel={handleModalCancel}
                                visible={visible.value}/>
                        </a-card>

                    </div>
                </div>

            </div>
        )
    }
})

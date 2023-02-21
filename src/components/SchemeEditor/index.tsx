import {computed, defineComponent, defineEmits, defineProps, reactive, Ref, ref, UnwrapRef, onMounted} from 'vue';
import './index.less';
import Editable from './Editable.vue';
import {
    DownOutlined,
    RightOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
import Actions from "@/components/SchemeEditor/Actions";
import ExtraActions from "@/components/SchemeEditor/extraActions";
import SettingProps from './SettingProps.vue';

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
        const activeKey = ref('1');

        const addProps = (tree: any, e: any) => {

        }

        const moveUp = () => {
        };
        const moveDown = () => {
        };
        const copy = () => {
        };

        const setRequire = () => {
        };
        const addDesc = () => {
        };
        const del = () => {
        };

        function handleModalOk() {
            visible.value = false;
        }

        function handleModalCancel() {
            visible.value = false;
        }

        const showSettingPropsModal = (e: any, tree: any) => {
            visible.value = true;
        };

        function onTabChange(val: any) {
            activeKey.value = val;
        }


        const renderTree = (tree: any) => {
            if (isObject(tree.type)) {
                const {isRoot, isExpand, name, depth} = tree?.extraViewInfo || {};
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

                            {!isRoot ? <Editable value={name}/> : null}
                            {!isRoot ? <span class={'baseInfoSpace'}>:</span> : null}
                            <a href="javascript:void(0)"
                               onClick={showSettingPropsModal.bind(this, tree)}
                               class={[tree.type, 'setDataTypeAction']}
                            >{tree.type}</a>
                            <span class={'baseInfoSpace'}>{`{${Object.keys(tree.properties).length}}`}</span>
                            <PlusOutlined onClick={addProps.bind(this, tree)} class={'addIcon'}/>
                        </div>
                        <div class={'action'}>
                            <Actions moveDown={moveDown} moveUp={moveUp} copy={copy}/>
                        </div>
                        <div class={'extraAction'}>
                            <ExtraActions addDesc={addDesc} del={del} setRequire={setRequire}/>
                        </div>
                    </div>
                    <div class={{
                        'directoryContainer': tree,
                        'directoryContainerExpand': isExpand,
                        'directoryContainerFold': !isExpand
                    }}>
                        {
                            Object.entries(tree.properties).map(([key, value]: any) => {
                                const depth = value.extraViewInfo.depth;
                                if (isObject(value.type)) {
                                    return renderTree(value);
                                } else {
                                    return (<div class={'leafNode'} style={{'paddingLeft': `${depth * 30}px`}}>
                                        <div class={'leafNodeHorizontalLine'}
                                             style={{left: `${(depth - 1) * 30 + 8}px`}}/>
                                        <div class={'baseInfo'}>
                                            <Editable value={key}/>
                                            <span class={'baseInfoSpace'}>:</span>
                                            <a class={[value.type, 'setDataTypeAction']}
                                               onClick={showSettingPropsModal.bind(this, value)}
                                               href='javascript:void(0)'>{value.type}</a>
                                        </div>
                                        <div class={'action'}>
                                            <Actions moveDown={moveDown} moveUp={moveUp} copy={copy}/>
                                        </div>
                                        <div class={'extraAction'}>
                                            <ExtraActions addDesc={addDesc} del={del} setRequire={setRequire}/>
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

        return () => (
            <div class={'content'}>
                {renderTree(data)}
                <SettingProps
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    visible={visible.value}/>
            </div>
        )
    }
})

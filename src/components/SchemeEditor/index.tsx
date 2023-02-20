import {computed, defineComponent, defineEmits, defineProps, reactive, Ref, ref, UnwrapRef, onMounted} from 'vue';
import './index.less';
import contenteditable from 'vue-contenteditable';
import {DownOutlined,RightOutlined,PlusOutlined} from '@ant-design/icons-vue';

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
            "required": [
                "name"
            ],
            "properties": {
                "name": {
                    "type": "string"
                },
                // "address": {
                //     "$ref": "#/components/schemas/Address"
                // },
                "age": {
                    "type": "integer",
                    "format": "int32",
                    "minimum": 0
                },
                'obj1': {
                    "type": "object",
                    "required": [
                        "name"
                    ],
                    "properties": {
                        "name1": {
                            "type": "string"
                        },
                        "age1": {
                            "type": "integer",
                            "format": "int32",
                            "minimum": 0
                        },
                        'obj2':{
                            "type": "object",
                            "required": [
                                "name11"
                            ],
                            "properties": {
                                "name3232": {
                                    "type": "string"
                                },
                                // "address": {
                                //     "$ref": "#/components/schemas/Address"
                                // },
                                "age3333": {
                                    "type": "integer",
                                    "format": "int32",
                                    "minimum": 0
                                },
                                'obj4341': {
                                    "type": "object",
                                    "required": [
                                        "name"
                                    ],
                                    "properties": {
                                        "name1332323": {
                                            "type": "string"
                                        },
                                        "age22221": {
                                            "type": "integer",
                                            "format": "int32",
                                            "minimum": 0
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const renderTree = (tree: any) => {
            if (isObject(tree.type)) {
                return <div class={'directoryNode'}>
                    <div>
                        <DownOutlined/>
                        <RightOutlined/>
                        <a className={'directoryText'} href="javacript:void()0">{tree.type}</a>
                        <span>{`{${Object.keys(tree.properties).length}}`}</span>
                        <PlusOutlined />

                    </div>
                    {
                        Object.entries(tree.properties).map(([key, value]) => {
                            if (isObject(value.type)) {
                                return renderTree(value);
                            } else {
                                return (<div class={'leafNode'}>
                                    <input type="text" size={key.length || 4} value={key || 'name'}/>
                                    <span>:</span>
                                    <span>{value.type}</span>
                                </div>)
                            }
                        })
                    }
                </div>
            }
        }


        return () => (
            <div class={'content'}>
                {renderTree(data)}
            </div>
        )
    }

})

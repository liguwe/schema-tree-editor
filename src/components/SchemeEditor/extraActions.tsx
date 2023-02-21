import {
    DeleteOutlined,
    InfoCircleOutlined,
    ReadOutlined
} from '@ant-design/icons-vue';

export default (props: {
    setRequire: () =>void,
    addDesc: () => void,
    del: () => void,
}) => {
    return <a-space size={12} align={'end'}>
        <a-tooltip placement="topLeft" title="是否必填？" arrow-point-at-center>
            <InfoCircleOutlined onClick={props.setRequire}/>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="添加描述" arrow-point-at-center>
            <ReadOutlined onClick={props.addDesc}/>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="删除" arrow-point-at-center>
            <DeleteOutlined onClick={props.del}/>
        </a-tooltip>
    </a-space>
}

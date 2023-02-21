import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    CopyOutlined,
} from '@ant-design/icons-vue';

export default (props: {
    moveUp: () => void,
    moveDown: () => void,
    copy: () => void,
}) => {
    return <a-space size={12} align={'end'}>
        <a-tooltip placement="topLeft" title="向上移动" arrow-point-at-center>
            <ArrowUpOutlined onClick={props.moveUp}/>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="向下移动" arrow-point-at-center>
            <ArrowDownOutlined onClick={props.moveDown}/>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="复制" arrow-point-at-center>
            <CopyOutlined onClick={props.copy}/>
        </a-tooltip>
    </a-space>
}

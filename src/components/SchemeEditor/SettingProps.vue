<template>
  <a-modal :visible="visible"
           title="Basic Modal"
           @cancel="handleCancel"
           @ok="handleOk">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Type">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item :label="null">
            <a-select v-model:value="formState.region" placeholder="please select your zone">
              <a-select-option value="array">array</a-select-option>
              <a-select-option value="number">number</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Components" force-render>Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="Combine Schemas">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineComponent, ref, defineProps, defineEmits, watch, reactive, toRaw, UnwrapRef} from 'vue';
interface FormState {
  name: string;
  region: string | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const  activeKey=  ref('1');
const props = defineProps({
  visible: {
    required: true,
    type: Boolean,
  }
})
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  region: undefined,
  date1: undefined,
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const emit = defineEmits(['ok', 'cancal']);

const handleOk = (e: MouseEvent) => {
  emit('ok');
};
watch(() => {
  return props.visible
}, () => {
  console.log('832', props.visible)
})

function handleCancel() {
  emit('cancal');
}
</script>
<style lang="less" scoped>


</style>

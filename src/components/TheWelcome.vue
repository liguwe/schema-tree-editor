

<template>
  <a-popconfirm
      title="Are you sure delete this task?"
      ok-text="Yes"
      cancel-text="No"
      @confirm="confirm"
      @cancel="cancel"
  >
    <a href="#">Delete</a>
  </a-popconfirm>

</template>

<script lang="ts">

import {message} from 'ant-design-vue';


const confirm = (e: MouseEvent) => {
  console.log(e);
  message.success('Click on Yes');
};

const cancel = (e: MouseEvent) => {
  console.log(e);
  message.error('Click on No');
};


</script>


<style lang="less" scoped>

</style>

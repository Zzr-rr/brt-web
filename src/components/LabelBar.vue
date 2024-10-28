<template>
  <div class="label-bar">
    <el-tag
      v-for="(label, index) in labels"
      :key="index"
      :type="getTagType(index)"
      class="label"
      effect="plain"
    >
      {{ label }}
    </el-tag>
  </div>
</template>

<script setup>
defineProps({
  labels: {
    type: Array,
    required: true,
  },
});
const getTagType = (index) => {
  const tagTypes = ['primary', 'success', 'info', 'warning', 'danger'];
  return tagTypes[index % tagTypes.length];
};
</script>

<style scoped>
.label-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.label {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}
</style>

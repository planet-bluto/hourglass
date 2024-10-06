<script setup lang="ts">
const props = defineProps({
  settings_key: String,
  label: String,
  checked: Boolean
})
const emit = defineEmits(['input'])
</script>

<template>
  <div id="container">
    <div class="checkbox-wrapper-17">
      <input
        type="checkbox"
        :checked="checked"
        :id="'switch-' + props.settings_key"
        @input="
          ($event) => {
            emit('input', $event, props.settings_key)
          }
        "
      />
      <label :for="'switch-' + props.settings_key"></label>
    </div>
    <p>{{ props.label }}</p>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
}

.checkbox-wrapper-17 {
  margin-right: 10px;
  height: min-content;
  display: flex;
}

.checkbox-wrapper-17 input[type='checkbox'] {
  height: 0;
  width: 0;
  visibility: hidden;
  margin: 0px;
}

.checkbox-wrapper-17 label {
  --size: 50px;

  cursor: pointer;
  width: var(--size);
  height: calc(var(--size) / 2);
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
}

.checkbox-wrapper-17 label:after {
  content: '';
  position: absolute;
  top: 6%;
  left: 2.5%;
  width: calc(50% - 5%);
  height: calc(100% - 11%);
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

.checkbox-wrapper-17 input:checked + label {
  background: var(--theme-active);
}

.checkbox-wrapper-17 input:checked + label:after {
  left: calc(100% - 2.5%);
  transform: translateX(-100%);
}

.checkbox-wrapper-17 label:active:after {
  width: 55%;
}
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  export let checked = false;
  export let right = false;
  export let disabled = false;
  export let label = '';
  export let indented = false;

  const dispatch = createEventDispatcher();
</script>


<label
  class="custom-checkbox"
  class:right
  class:indented
>
  {#if label}
    {label}
  {/if}
  <input
    class="checkbox"
    type="checkbox"
    {disabled}
    {checked}
    on:change="{event => {
      dispatch('change', event.target.checked);
    }}"
  />
</label>

<style lang="scss">
  .custom-checkbox {
    position: relative;
    padding-left: 45px;
    font-size: 14px;
    color: var(--color-text-softer);
    cursor: pointer;
    min-height: 20px;
    margin-bottom: 15px;
    &.right {
      padding-right: 45px;
      padding-left: 0;
      .checkbox {
        left: auto;
        right: 5px;
      }
    }
    &.indented {
      padding-left: 60px;
      .checkbox {
        left: 15px;
      }
    }
    .checkbox {
      -webkit-appearance: none;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      margin: 0;
      cursor: pointer;
      outline: none;
      height: 20px;
      width: 35px;
      margin-bottom: 0;
      background-color: var(--color-main-bg-softer);
      border-radius: 50px;
      transition: .2s;
      border: none;
      &::before {
        content: '';
        position: absolute;
        height: 16px;
        width: 16px;
        background-color: var(--color-main-bg-softest);
        border-radius: 50%;
        left: 3px;
        top: 2px;
        transition: .3s;
      }
      &:checked {
        background-color: var(--color-main-bg-softer);
        &::before {
          background-color: var(--color-text-soft);
          left: 15px;
        }
      }
    }
  }
</style>

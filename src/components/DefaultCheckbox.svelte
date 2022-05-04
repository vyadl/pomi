<script>
  import { createEventDispatcher } from 'svelte';

  export let checked;
  export let label;
  export let text;
  export let right;
  export let disabled;

  const dispatch = createEventDispatcher();
</script>

{#if label}
  <label class="label" class:right>
    {text}
    <input
      class="checkbox"
      type="checkbox"
      disabled="{disabled}"
      bind:checked
      on:change="{event => {
        dispatch('change', event.target.checked);
      }}"
    />
  </label>
{:else}
  <input
    class="checkbox unwrapped"
    type="checkbox"
    disabled="{disabled}"
    bind:checked
    on:change="{event => {
      dispatch('change', event.target.checked);
    }}"
  />
{/if}

<style lang="scss">
  .label {
    position: relative;
    padding-left: 45px;
    font-size: 14px;
    color: #bbb;
    cursor: pointer;
    min-height: 20px;
    &.right {
      padding-right: 45px;
      padding-left: 0;
      .checkbox {
        left: auto;
        right: 5px;
      }
    }
  }
  .checkbox {
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    outline: none;
    height: 20px;
    width: 35px;
    margin-bottom: 0;
    background-color: #666;
    border-radius: 50px;
    transition: 0.3s;
    border: none;
    &.unwrapped {
      position: relative;
      transform: none;
      left: 0;
      top: 0;
    }
    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      background-color: #888;
      border-radius: 50%;
      left: 3px;
      top: 2px;
      transition: 0.3s;
    }
    &:checked {
      background-color: #777;
      &::before {
        background-color: #ccc;
        left: 15px;
      }
    }
  }
</style>

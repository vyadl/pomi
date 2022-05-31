<script>
  import { createEventDispatcher } from 'svelte';

  export let checked;
  export let label;
  export let text = '';
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
    color: var(--color-text-softer);
    cursor: pointer;
    min-height: 20px;
    word-break: break-all;
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
    background-color: var(--color-main-bg-softer);
    border-radius: 50px;
    transition: .2s;
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
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let value;
  export let wide = false;
  export let autofocus = false;
  export let label = false;
  export let labelText = '';
  export let errormessage = '';
  let inputEl;

onMount(() => {
  if (autofocus) {
    inputEl.focus();
  }
});

const dispatch = createEventDispatcher();

function onChange() {
  errormessage = '';
  dispatch('change', value);
}
</script>
<div
  class="text-input"
  class:wide
>
  {#if label}
    <label class="label">
      <div class="label-text">{labelText}</div>
      <input
        type="text"
        class="input"
        bind:value
        on:input={onChange}
        bind:this={inputEl}
      />
    </label>
  {:else}
    <input
      type="text"
      class="input"
      bind:value
      bind:this={inputEl}
      on:input={onChange}
    />
  {/if}
  {#if errormessage}
    <div class="error-message">{errormessage}</div>
  {/if}
</div>

<style lang="scss">
  .text-input {
    .label {
      display: block;
    }
    .label-text {
      display: block;
      margin-bottom: 7px;
      font-size: 12px;
      color: #888;
    }
    .input {
      background: none;
      border: none;
      border-bottom: 2px solid #444;
      transition: border-color 0.2s;
      color: #aaa;
      font-size: 14px;
      padding: 5px;
      &.wide {
        width: 100%;
      }
      &:focus {
        outline: none;
        border-bottom-color: #888;
      }
    }
    &.wide {
      .input {
        width: 100%;
      }
    }
    .error-message {
      font-size: 12px;
      padding-left: 5px;
      color: #999;
    }
  }
</style>

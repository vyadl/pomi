<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let value;
  export let wide = false;
  export let autofocus = false;
  export let label = '';
  export let errormessage = '';
  export let readonly = false;
  export let required = false;
  export let pure = false;
  export let central = false;  
  export let type = 'text';
  let inputEl;

onMount(() => {
  if (autofocus) {
    inputEl.focus();
  }
});

const dispatch = createEventDispatcher();

function onChange() {
  errormessage = '';
  dispatch('input', value);
}
</script>
<div
  class="text-input"
  class:wide
  class:pure
  class:central
>
  <label class="label">
    {#if label}
      <div class="label-text">{label}{required ? '*' : ''}</div>
    {/if}
    {#if type === 'text'}
      <input
        type="text"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onChange}
        bind:this={inputEl}
      />
    {/if}
    {#if type === 'time'}
      <input
        type="time"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onChange}
        bind:this={inputEl}
      />
    {/if}
    {#if type === 'date'}
      <input
        type="date"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onChange}
        bind:this={inputEl}
      />
    {/if}
  </label>
  {#if errormessage}
    <div class="error-message">{errormessage}</div>
  {/if}
</div>

<style lang="scss">
  .text-input {
    &.wide {
      .input {
        width: 100%;
      }
    }
    &.pure {
      .input {
        padding-left: 0;
        border: none;
      }
    }
    &.central {
      text-align: center;
      .input {
        text-align: center;
      }
    }
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
      transition: border-color .2s;
      color: #aaa;
      font-size: 14px;
      padding: 5px;
      &.wide {
        width: 100%;
      }
      &:focus {
        outline: none;
        &:not(:read-only) {
          border-bottom-color: #888;
        }
      }
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    }
    .error-message {
      font-size: 12px;
      padding-left: 5px;
      color: #999;
    }
  }
</style>

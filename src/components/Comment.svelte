<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import { comment } from './../store/counter.js';
  import TextInput from './form-elements/TextInput.svelte';

  export let active = false;
  export let visible = false;

  const dispatch = createEventDispatcher();
</script>

<div class="comment">
  <div class="top-line" class:visible>
    <div
      class="control"
      class:active
      on:click="{() => {
        dispatch('switch');
      }}"
    >
      {$_('comment_for_period')}
    </div>
  </div>
  {#if active}
    <div class="input-wrap" transition:slide>
      <TextInput bind:value="{$comment}" wide />
    </div>
  {/if}
</div>

<style lang="scss">
  .comment {
    margin-bottom: 15px;
  }
  .top-line {
    font-size: 12px;
    text-align: right;
    margin-bottom: 10px;
    pointer-events: none;
    opacity: 0;
    transition: opacity .2s;
    &.visible {
      pointer-events: all;
      opacity: 1;
    }
  }
  .control {
    cursor: pointer;
    opacity: .8;
    color: var(--color-text-softer);
    transition: opacity .2s;
    &:hover,
    &.active {
      opacity: 1;
    }
  }
</style>

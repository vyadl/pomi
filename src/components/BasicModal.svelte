<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let active = false;

  const dispatch = createEventDispatcher();

  function handleKeydown(event) {
    if (active && event.keyCode === 27) {
      dispatch('close');
    }
  }
</script>

<svelte:window on:keydown="{handleKeydown}" />
<svelte:head>
  {#if active}
    <style>
      body {
        overflow: hidden;
      }
    </style>
  {/if}
</svelte:head>

{#if active}
  <div class="modal" transition:fade>
    <slot />
    <div
      class="close"
      on:click="{() => {
        dispatch('close');
      }}"
    ></div>
  </div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    display: flex;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.96);
    padding-top: 40px;
    overflow: auto;
  }

  .close {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 30px;
    height: 30px;
    user-select: none;
    color: #aaa;
    transition: opacity 0.2s;
    cursor: pointer;
    opacity: 0.6;
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      rotate: 45deg;
      background-color: #fff;
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &:hover {
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    .close {
      top: 5px;
      right: 10px;
      width: 25px;
      height: 35px;
    }
  }
</style>

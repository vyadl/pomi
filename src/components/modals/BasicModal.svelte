<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let active = false;
  export let title = '';

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
  <div
    class="basic-modal"
    transition:fade={{ duration: 200 }}
  >
    <div class="inner">
      {#if title}
        <h1 class="title">{title}</h1>
      {/if}
      <div class="main">
        <slot />
      </div>
      <div
        class="close"
        on:click="{() => {
          dispatch('close');
        }}"
      ></div>
    </div>
  </div>
{/if}

<style lang="scss">
  .basic-modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    overflow: auto;
    background-color: var(--color-main-bg-mask);
    .inner {
      padding: 40px 0 60px;
    }
    .title {
      font-size: 18px;
      color: var(--color-text);
      margin-bottom: 30px;
      text-align: center;
    }
    .close {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 30px;
      height: 30px;
      user-select: none;
      color: var(--color-text-softer);
      transition: opacity .2s;
      cursor: pointer;
      opacity: .6;
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
        background-color: var(--color-text);
      }
      &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      &:hover {
        opacity: 1;
      }
    }
  }

  @media (max-width: 640px) {
    .basic-modal {
      .close {
        top: 5px;
        right: 10px;
        width: 25px;
        height: 35px;
      }
    }
  }
</style>

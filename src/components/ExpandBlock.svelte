<script>
  import { slide } from 'svelte/transition';

  export let active = false;
  export let title = false;
  export let small = false;
  export let right = false;
  export let center = false;
</script>

<div
  class="title"
  class:active
  class:small
  class:right
  class:center
  on:click="{() => {
    active = !active;
  }}"
>
  {title}
</div>
{#if active}
  <div transition:slide>
    <slot />
  </div>
{/if}

<style lang="scss">
  .title {
    transition: opacity 0.2s;
    opacity: 0.5;
    color: #aaa;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    padding: 10px 0;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 3px;
      width: 7px;
      height: 7px;
      border-right: 1px solid #888;
      border-bottom: 1px solid #888;
      transform: rotate(45deg) translateY(-40%);
      transition: transform 0.2s, right 0.2s;
    }
    &.active {
      opacity: 1;
      &::before {
        transform: rotate(-135deg);
        right: 0;
      }
    }
    &:hover {
      opacity: 0.8;
    }
    &.small {
      &::before {
        width: 5px;
        height: 5px;
        transform: rotate(45deg) translateY(-85%);
      }
      font-size: 11px;
      &.active {
        &::before {
          transform: rotate(-135deg) translateY(10%);
        }
      }
    }
    &.right {
      padding-right: 15px;
      text-align: right;
    }
    &.center {
      text-align: center;
    }
  }
</style>

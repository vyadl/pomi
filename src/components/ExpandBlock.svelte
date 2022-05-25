<script>
  export let active = false;
  export let title = false;
  export let small = false;
  export let big = false;
  export let right = false;
  export let center = false;
</script>

<div
  class="title"
  class:active
  class:small
  class:big
  class:right
  class:center
  on:click="{() => {
    active = !active;
  }}"
>
  {title}
</div>
{#if active}
  <slot />
{/if}

<style lang="scss">
  .title {
    transition: opacity .2s;
    opacity: .5;
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
      transition: transform .2s, right .2s;
    }
    &.active {
      opacity: 1;
      &::before {
        transform: rotate(-135deg);
        right: 0;
      }
    }
    &:hover {
      opacity: .8;
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
    &.big {
      font-size: 18px;

      &::before {
        width: 10px;
        height: 10px;
        transform: rotate(45deg) translateY(-55%);
      }
      &.active {
        &::before {
          transform: rotate(-135deg) translate(-10%, 10%);
        }
      }
    }
    &.right {
      padding-right: 25px;
      text-align: right;
    }
    &.center {
      text-align: center;
    }
  }
</style>

<script>
  export let active = false;
  export let small = false;
  export let vertical = false;
  export let bordered = false;
  export let type = 'button';
</script>

<button
  class="button"
  class:active
  class:small
  class:vertical
  class:bordered
  type="{type}"
  on:click
>
  <slot />
</button>

<style lang="scss">
  .button {
    padding: 10px 30px;
    background-color: transparent;
    color: #bbb;
    opacity: 0.5;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s opacity, background-color 0.2s;
    text-align: center;
    &:hover,
    &:active {
      opacity: 1;
      background-color: transparent;
    }
    &.active {
      background-color: #252525;
      opacity: 1;
      &:hover,
      &:active {
        opacity: 1;
        background-color: #252525;
        cursor: initial;
      }
    }
    &.small {
      font-size: 12px;
      padding: 5px 10px;
    }
    &.vertical {
      padding-left: 0;
      padding-right: 0;
    }
    &.bordered {
      border: 2px solid currentColor;
    }
  }
</style>

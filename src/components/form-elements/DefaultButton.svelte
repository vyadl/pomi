<script>
  export let active = false;
  export let small = false;
  export let big = false;
  export let vertical = false;
  export let bordered = false;
  export let activeBordered = false;
  export let type = 'button';
  export let alignLeft = false;
  export let alignRight = false;
  export let tab = false;
  export let pure = false;
</script>

<button
  class="button"
  class:active
  class:small
  class:big
  class:vertical
  class:bordered
  class:tab
  class:pure
  class:active-bordered="{activeBordered}"
  class:align-left="{alignLeft}"
  class:align-right="{alignRight}"
  type="{type}"
  on:click
>
  <slot />
</button>

<style lang="scss">
  .button {
    padding: 10px 23px;
    background-color: var(--color-main-bg);
    color: var(--color-text-softer);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: .2s color, background-color .2s, border .2s;
    text-align: center;
    &:hover,
    &:active {
      color: var(--color-text);
    }
    &.active {
      background-color: var(--color-main-bg-softer);
      &:hover,
      &:active {
        background-color: var(--color-main-bg-softer);
      }
    }
    &.active-bordered {
      border: 2px solid var(--color-main-bg);
      padding: 6px 19px;
      &.active {
        background-color: var(--color-main-bg);
        border: 2px solid var(--color-border-hard);
      }
    }
    &.small {
      font-size: 12px;
      padding: 5px 10px;
    }
    &.pure {
      &.active {
        background-color: var(--color-main-bg);
        color: var(--color-text-soft);
      }
    }
    &.big {
      font-size: 20px;
    }
    &.vertical {
      padding-left: 0;
      padding-right: 0;
    }
    &.bordered {
      border: 2px solid var(--color-main-bg-softest);
    }
    &.align-left {
      text-align: left;
    }
    &.align-right {
      text-align: right;
    }
    &.tab {
      border: 3px solid var(--color-main-bg);
      padding: 6px 19px;
      letter-spacing: 1px;
      &.active {
        background-color: var(--color-main-bg);
        border: 3px solid var(--color-border-hard);
      }
    }
  }
</style>

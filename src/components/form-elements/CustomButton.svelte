<script>
  export let active = false;
  export let small = false;
  export let big = false;
  export let bordered = false;
  export let activeBordered = false;
  export let activeBigger = false;
  export let alignLeft = false;
  export let alignRight = false;
  export let tabLike = false;
  export let onlyText = false;
  export let underline = false;
  export let dimmed = false;
  export let disabled = false;
  export let title = '';
  export let type = 'button';
</script>

<button
  class="custom-button"
  class:active
  class:small
  class:big
  class:bordered
  class:underline
  class:dimmed
  class:only-text="{onlyText}"
  class:tab-like="{tabLike}"
  class:active-bordered="{activeBordered}"
  class:active-bigger="{activeBigger}"
  class:align-left="{alignLeft}"
  class:align-right="{alignRight}"
  type="{type}"
  title="{title}"
  on:click
  {disabled}
>
  <slot />
</button>

<style lang="scss">
  .custom-button {
    padding: 10px 20px;
    background-color: var(--color-main-bg);
    border: none;
    border-radius: 5px;
    color: var(--color-text-softer);
    text-align: center;
    letter-spacing: 1px;
    cursor: pointer;
    transition: transform .2s, color .2s, background-color .2s, border .2s;
    &:disabled {
      color: currentColor;
      &:hover {
        color: currentColor;
        cursor: default;
      }
    }
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
    &.active-bigger {
      &.active {
        transform: scale(1.2);
      }
    }
    &.small {
      font-size: 12px;
      padding: 5px 10px;
    }
    &.only-text {
      &.active {
        background-color: var(--color-main-bg);
        color: var(--color-text-soft);
      }
    }
    &.big {
      font-size: 20px;
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
    &.underline {
      text-decoration: underline;
    }
    &.dimmed {
      color: var(--color-text-softest);
      &:hover,
      &.active,
      &:active {
        color: var(--color-text-softer);
      }
    }
    &.tab-like {
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

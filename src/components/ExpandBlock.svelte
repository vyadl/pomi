<script>
  import TitleLine from './decorative/TitleLine.svelte';
  import CustomButton from './form-elements/CustomButton.svelte';
  
  export let active = false;
  export let title = '';
  export let small = false;
  export let big = false;
  export let right = false;
  export let center = false;
  export let fixedOpen = false;
  export let wider = false;
  export let noLine = false;
  export let withBorder = false;
  export let thin = false;
</script>

<div
  class="expand-block"
  class:thin
  class:with-border="{withBorder}"
  class:active="{fixedOpen || active}"
>
  {#if title}
    <div
      class="title"
      class:active="{fixedOpen || active}"
      class:small
      class:big
      class:right
      class:center
      class:fixed-open="{fixedOpen}"
      class:no-line="{noLine || withBorder}"
      on:click="{() => {
        active = !active;
      }}"
    >
      {#if !(noLine || withBorder)}
        <TitleLine
          bigFont="{active}"
          title="{title}"
          wider="{wider}"
        />
      {:else}
      <CustomButton
        active="{active}"
        onlyText
        small
      >
        {title}
      </CustomButton>
      {/if}
    </div>
  {/if}
  {#if fixedOpen || active}
    <div class="inner">
      <slot />
    </div>
  {/if}
</div>


<style lang="scss">
  .expand-block {
    &.with-border {
      position: relative;
      padding: 10px;
      border-radius: 10px;
      border-top: 3px solid var(--color-border);
      border-radius: 0;
      padding-top: 30px;
      transition: border .1s, border-radius .1s;
      .title {
        position: absolute;
        width: 100%;
        top: -25px;
        text-align: center;
        left: 0;
      }
      &.active {
        border: 3px solid var(--color-border-hard);
        border-radius: 10px;
        margin-bottom: 20px;
      }
      &.thin {
        border-width: 2px;
      }
    }
    .title {
      color: var(--color-text);
      position: relative;
      cursor: pointer;
      font-size: 14px;
      padding: 10px 0;
      margin-bottom: 10px;
      &::before {
        content: '';
        position: absolute;
        top: 5.5px;
        right: 30px;
        width: 10px;
        height: 10px;
        z-index: 10;
        border-right: 2px solid var(--color-text-softer);
        border-bottom: 2px solid var(--color-text-softer);
        border-radius: 0 0 3px 0;
        transform: rotate(45deg);
        background-color: var(--color-main-bg);
        transition: transform .2s;
      }
      &.no-line {
        &::before {
          display: none;
        }
      }
      &.fixed-open {
        pointer-events: none;

        &::before {
          display: none;
        }
      }
      &.active {
        &::before {
          transform: rotate(45deg) scale3d(-1, -1, 1);
          top: 5px;
        }
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
  }
</style>

<script>
  export let title = '';
  export let wider = false;
  export let bigFont = false;
</script>

<div
  class="title-line"
  class:wider
  class:big-font="{bigFont}"
>
  <h2 class="title">
    {title}
  </h2>
</div>

<style lang="scss">
  .title-line {
    position: relative;
    border-bottom: 2px solid var(--color-border-hard);
    margin-bottom: 25px;

    &.wider {
      margin-right: -15px;
      margin-left: -15px;
    }
    &.big-font {
      .title {
        font-size: 16px;
        bottom: -13px;
        padding: 5px 17px 5px 12px;
      }
    }

    .title {
      position: absolute;
      padding: 5px 12px;
      line-height: 1;
      font-size: 12px;
      bottom: -11px;
      left: 10%;
      white-space: nowrap;
      background-color: var(--color-main-bg);
      color: var(--color-text-soft);
      transition: font-size .2s, bottom .2s, padding .2s;
      border-radius: 5px;
    }
  }
</style>
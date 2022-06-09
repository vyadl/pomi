<script>
  export let title = '';
</script>

<div class="setting-description">
  {#if title}
    <h3 class="title">{title}</h3>
  {/if}
  <div class="inner">
    <slot />
  </div>
</div>

<style lang="scss">
  .setting-description {
    padding: 15px 0;
    margin-bottom: 15px;
    .title {
      margin-bottom: 15px;
      font-size: 14px;
      padding-left: 16px;
    }
    .inner {
      padding: 15px;
      border: 1px solid var(--color-border-hard);
      background-color: var(--color-main-bg-soft);
      border-radius: 10px;
      font-size: 12px;
    }  
  }
</style>

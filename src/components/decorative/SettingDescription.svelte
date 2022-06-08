

<div class="setting-description">
  <div class="inner">
    <slot />
  </div>
</div>

<style lang="scss">
  .setting-description {
    padding: 15px 0;
    margin-bottom: 15px;
    .inner {
      padding: 15px;
      border: 1px solid var(--color-border-hard);
      background-color: var(--color-main-bg-soft);
      border-radius: 10px;
      font-size: 12px;
    }  
  }
</style>

<script>
import CustomButton from './form-elements/CustomButton.svelte';

export let tabs = [];
export let activeTab = '';
</script>

<div
  class="tabs"
  class:active={activeTab}
>
  <div class="tabs-controls">
    {#each tabs as tab}
      <CustomButton
        tabLike
        active={activeTab === tab.id}
        on:click="{() => {activeTab = activeTab === tab.id ? '' : tab.id}}"
      >
        {tab.title}
      </CustomButton>
    {/each}
  </div>
  <div class="components">
    <div class="components-inner">
      {#each tabs as tab}
        {#if activeTab === tab.id}
          <svelte:component this={tab.component} {...tab.props} />
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
.tabs {
  position: relative;
  border-top: 3px solid var(--color-border);
  border-radius: 0;
  padding-top: 30px;
  transition: border .1s, border-radius .1s;
  &.active{
    border: 3px solid var(--color-border-hard);
    border-radius: 20px;
  }
  .tabs-controls {
    position: absolute;
    width: 100%;
    top: -20px;
    display: flex;
    justify-content: center;
    gap: 50px;
  }
  .components-inner {
    padding: 0 15px;
  }
}
</style>

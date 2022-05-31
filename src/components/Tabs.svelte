<script>
import DefaultButton from './form-elements/DefaultButton.svelte';

export let tabs = [];
export let activeTab = '';
export let pure = false;
export let slot = null;
export let title = '';
</script>

<div
  class="tabs"
  class:active={activeTab}
  class:pure
>
  <div class="tabs-controls">
    {#if !slot}
      {#each tabs as tab}
        <DefaultButton
          tab="{!pure}"
          active={activeTab === tab.id}
          on:click="{() => {activeTab = activeTab === tab.id ? '' : tab.id}}"
        >
          {tab.title}
        </DefaultButton>
      {/each}
    {:else}
    <DefaultButton
      tab="{!pure}"
      on:click="{() => {activeTab = !activeTab}}"
    >
      {title}
    </DefaultButton>
    {/if}
  </div>
  <div class="components">
    <div class="components-inner">
      {#if !slot}
        {#each tabs as tab}
          {#if activeTab === tab.id}
            <svelte:component this={tab.component} {...tab.props} />
          {/if}
        {/each}
      {:else}
        {#if activeTab}
          <slot/>
        {/if}
      {/if}
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
  &.active:not(.pure) {
    border: 3px solid var(--color-border-hard);
    border-radius: 20px;
  }
  &.pure {
    border: none;
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

<script>
import { _ } from 'svelte-i18n';
import { fade } from 'svelte/transition';
import Tags from './Tags.svelte';
import Statistics from './statistics/Statistics.svelte';
import DefaultButton from './DefaultButton.svelte';

let activeTab = '';

</script>

<div class="tabs">
  <div class="tabs-controls">
    <DefaultButton
      class="tab"
      active={activeTab === 'tags'}
      on:click="{() => {activeTab = activeTab === 'tags' ? '' : 'tags'}}"
    >
      {$_('activities')}
    </DefaultButton>
    <DefaultButton
      class="tab"
      active={activeTab === 'statistics'}
      on:click="{() => {activeTab = activeTab === 'statistics' ? '' : 'statistics'}}"
    >
      {$_('history')}
    </DefaultButton>
  </div>
  <div class="components">
    {#if activeTab === 'tags'}
      <Tags />
    {:else if activeTab === 'statistics'}
      <Statistics />
    {/if}
  </div>
</div>

<style lang="scss">
.tabs {
  .tabs-controls {
    text-align: center;
    position: relative;
  }
}
</style>
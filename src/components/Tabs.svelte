<script>
import { _ } from 'svelte-i18n';
import Activities from './Activities.svelte';
import Statistics from './statistics/Statistics.svelte';
import DefaultButton from './form-elements/DefaultButton.svelte';

let activeTab = '';

</script>

<div class="tabs">
  <div class="tabs-controls">
    <DefaultButton
      class="tab"
      active={activeTab === 'activities'}
      on:click="{() => {activeTab = activeTab === 'activities' ? '' : 'activities'}}"
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
    {#if activeTab === 'activities'}
      <Activities />
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
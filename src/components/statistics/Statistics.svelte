<script>
  import { _ } from 'svelte-i18n';
  import {
    statArr,
    initStat,
    statTotal,
  } from './../../store/statistics.js';
  import ExpandBlock from './../ExpandBlock.svelte';
  import DayStat from './DayStat.svelte';
  import AllDayRecords from './AllDayRecords.svelte';
  
  initStat();
</script>

<div class="statistics">
  {#each $statArr as dayStat}
    {#if dayStat.data.length}
      <div class="day">
        <ExpandBlock
          title="{dayStat.name}"
          center
          big
        >
          <div class="main-data">
            {#if $statTotal[dayStat.name] && $statTotal[dayStat.name].all}
              <DayStat
                dayStatTitle="{dayStat.name}"
                expanded
              />
            {/if}
          </div>
        </ExpandBlock>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .statistics {
    padding: 10px 0;
  }
</style>

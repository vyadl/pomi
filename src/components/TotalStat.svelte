<script>
  import { _ } from 'svelte-i18n';
  import {
    initStat,
    makeHoursAndMinutes,
    currentDayStat,
  } from './../store/statistics.js';
  import { activityFactor } from './../store/intervals.js';

  initStat();
</script>

<div class="total-stat">
  <div>{$_('done_today')}</div>
  <div class="activity-sum">
    {#if $currentDayStat?.sum?.activities}
    <div>
      {makeHoursAndMinutes($currentDayStat.sum.activities * $activityFactor)}
    </div>
    <div class={$activityFactor ? 'pure' : ''}>
      {#if $activityFactor}
        {$_('pure_time')} -
      {/if}
      {makeHoursAndMinutes($currentDayStat.sum.activities)}
    </div>
    {:else}
      {$_('nothing_yet')}
    {/if}
  </div>
</div>

<style lang="scss">
.total-stat {
  display: flex;
  justify-content: space-between;
  transition: background-color 0.2s;
  padding: 2px 0;
  font-size: 17px;
  color: #aaa;
  letter-spacing: 1px;
  padding: 25px 0 45px;
  .activity-sum {
    text-align: right;
  }
  .pure {
    font-size: 12px;
    color: #555;
  }
}
</style>
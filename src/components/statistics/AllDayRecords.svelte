<script>
  import { _ } from 'svelte-i18n';
  import { stat } from './../../store/statistics.js';
  import { makeAbsoluteTimeString } from './../../utils.js';
  import { settings } from './../../store/settings.js';
  import EditRecordModal from './../modals/EditRecordModal.svelte';

  export let dayStat = [];
  export let date = '';
  
  let currentRecord = null;
  let nextRecord = null;
  let currentRecordIndex = null;
  let dayTitle = null;
  
  function openEditModal(record, recordIndex) {
    currentRecord = JSON.parse(JSON.stringify(record));
    currentRecordIndex = recordIndex;
    dayTitle = date;
    nextRecord = dayStat[recordIndex + 1]
      ? JSON.parse(JSON.stringify(dayStat[recordIndex + 1]))
      : null;
  }

  function resetEditing() {
    currentRecordIndex = null;
    dayTitle = null;
    nextRecord = null;
    currentRecord = null;
  }
</script>

<div class="all-day-records">
  {#each dayStat as record, recordIndex}
    <div
      class="record"
      class:activity="{record.intervalId === 'main'}"
      on:click="{() => { openEditModal(record, recordIndex) }}"
    >
      <div class="record-main">
        <div class="activity-part">
          {record.activityTitle} ({record.duration} {$_('min')}{
            $settings.showPlannedDuration
              && record.plannedDuration !== record.duration
                ? `, ${record.plannedDuration} ${$_('planned')}` 
                : ''})
          {record.intervalId !== 'main' ? $_('interval_labels.' + record.intervalId) : ''}
        </div>
        <div class="time">
          {#if record.startedAt}
            <div>
              {$_('started_at')}
              <span>
                {makeAbsoluteTimeString(record.startedAt, true)}
              </span>
            </div>
          {/if}
          {#if record.finishedAt}
            <div>
              {$_('finished_at')}
              <span>
                {makeAbsoluteTimeString(record.finishedAt, true)}
              </span>
            </div>
          {/if}
        </div>
      </div>
      {#if record.comment}
        <div class="record-comment">{$_('comment')}: {record.comment}</div>
      {/if}
    </div>
  {/each}
  <EditRecordModal
    bind:record="{currentRecord}"
    bind:recordIndex="{currentRecordIndex}"
    bind:dayTitle="{dayTitle}"
    bind:nextRecord="{nextRecord}"
    on:close={resetEditing}
  />
</div>


<style lang="scss">
.all-day-records {
  .record {
    padding: 4px 0;
    transition: background-color .2s;
    position: relative;
    font-size: 12px;
    cursor: pointer;
    &.activity {
      color: #555;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  .record-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .record-comment {
    padding-top: 5px;
  }

  .activity-part {
    width: 50%;
    margin-right: 15px;
  }

  .time {
    text-align: right;
  }
}
</style>
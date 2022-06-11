<script>
  import { _ } from 'svelte-i18n';
  import {
    getFullTimeFromTimestamp,
    getHoursAndMinutesFromMinutes,
  } from './../../utils/timeUtils.js';
  import { settings } from './../../store/settings.js';
  import HandleRecordModal from './../modals/HandleRecordModal.svelte';
  import CustomButton from './../form-elements/CustomButton.svelte';

  export let dayStat = [];
  export let date = '';

  $: sortedDayStat = [...dayStat].sort((a, b) => {
    return b.startedAt - a.startedAt;
  })
  
  let currentRecord = null;
  let currentRecordIndex = null;
  let dayTitle = null;
  let isHandleRecordActive = false;
  let isAdding = false;
  
  function openEditModal(record, recordIndex) {
    currentRecord = JSON.parse(JSON.stringify(record));
    dayTitle = date;
    isAdding = false;
    isHandleRecordActive = true;
  }

  function openAddModal() {
    dayTitle = date;
    isAdding = true;
    isHandleRecordActive = true;
  }

  function resetEditing() {
    isHandleRecordActive = false;
    currentRecordIndex = null;
    dayTitle = null;
    currentRecord = null;
  }

  function getActivityString(record) {
    let activityString = `${record.activityTitle}
      (${getHoursAndMinutesFromMinutes(record.duration)}`;

    if (
      $settings.showPlannedDuration &&
      record.plannedDuration &&
      record.plannedDuration !== record.duration
    ) {
      activityString += `, ${getHoursAndMinutesFromMinutes(record.plannedDuration)}
        ${$_('planned')}`;
    }

    activityString += ')';

    if (record.intervalId !== 'main') {
      activityString += ' ' + $_('interval_labels.' + record.intervalId);
    }

    return activityString;
  }
</script>

<div class="all-day-records">
  {#each sortedDayStat as record}
    <div
      class="record"
      class:break="{record.intervalId !== 'main'}"
      on:click="{() => { openEditModal(record) }}"
      title="edit"
    >
      <div class="record-main">
        <div class="activity-part">
          {getActivityString(record)}
        </div>
        <div class="time">
          <div>
            {$_('started_at')}
            {getFullTimeFromTimestamp(record.startedAt)}
          </div>
          <div>
            {$_('finished_at')}
            {getFullTimeFromTimestamp(record.finishedAt)}
          </div>
        </div>
      </div>
      {#if record.comment}
        <div class="record-comment">
          {$_('comment')}: {record.comment}
        </div>
      {/if}
    </div>
  {/each}
  <div class="add-record">
    <CustomButton
      on:click="{openAddModal}"
    >
      {$_('add_record')}
    </CustomButton>
  </div>
  <HandleRecordModal
    bind:isAdding="{isAdding}"
    bind:active="{isHandleRecordActive}"
    bind:editingRecord="{currentRecord}"
    bind:dayTitle="{dayTitle}"
    on:close="{resetEditing}"
  />
</div>


<style lang="scss">
.all-day-records {
  .record {
    padding: 4px 0;
    transition: background-color .2s, transform .2s .03s;
    position: relative;
    font-size: 11px;
    cursor: pointer;
    border: 1px solid var(--color-main-bg-softest);
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: var(--color-main-bg-soft);
    &.break {
      color: var(--color-text-softest);
    }
    &:hover {
      background-color: var(--color-main-bg-soft-2);
      transform: scale(1.02);
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
  .add-record {
    text-align: center;
    padding: 15px;
    font-size: 14px;
  }
}
</style>

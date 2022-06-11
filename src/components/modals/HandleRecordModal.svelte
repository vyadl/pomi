<script>
  import { _ } from 'svelte-i18n';
  import { intervalsArr } from './../../store/intervals.js';
  import { createEventDispatcher } from 'svelte';
  import BasicModal from './BasicModal.svelte';
  import CustomInput from './../form-elements/CustomInput.svelte';
  import CustomSelect from './../form-elements/CustomSelect.svelte';
  import CustomButton from './../form-elements/CustomButton.svelte';
  import { activities, activityOptionsForSelect } from '../../store/activities.js';
  import { stat, dayRanges } from '../../store/statistics.js';
  import { askConfirmation } from '../../store/confirmation.js';
  import { isRangeIntersectRanges } from './../../utils/generalUtils.js';
  import {
    getDateStampByDayTitleAndTime,
    getHoursAndMinutesFromMinutes,
    getHoursAndMinutesFromTimestamp,
  } from './../../utils/timeUtils.js';

  const dispatch = createEventDispatcher();
  export let dayTitle = null;
  export let active = false;
  export let isAdding = false;
  export let editingRecord = null;

  const recordTemplate = {
    intervalId: 'main',
    startTime: '',
    endTime: '',
    activityId: '',
    activityTitle: '',
    duration: '',
    comment: '',
  };
  let errorMessage = '';
  let record = {...recordTemplate};
  let isTimeChanged = false;

  $: isAdding && active && prefillForAdding();
  $: convertRecordForEditing(editingRecord);
  $: calculatedDuration = dayTitle && record.startTime && record.endTime
    ? record.endTime >= record.startTime
      ? getHoursAndMinutesFromMinutes(Math.ceil((endTimestamp - startTimestamp) / (1000 * 60)))
      : $_('not_correct')
    : '';
  $: intervalOptions = $intervalsArr.map(item => ({ value: item[0], text: $_('interval_labels.' + item[0]) }));
  $: startTimestamp = dayTitle &&
    record.startTime[2] !== '.' &&
    getDateStampByDayTitleAndTime(dayTitle, record.startTime);
  $: endTimestamp = dayTitle &&
    record.startTime[2] !== '.' &&
    getDateStampByDayTitleAndTime(dayTitle, record.endTime);
  $: activitiesOptions = isAdding
    ? $activityOptionsForSelect
    : [
    ...$activityOptionsForSelect,
    ...$activities[record?.activityId]
      ? []
      : [{ value: record?.activityId, text: record?.activityTitle + ` (${$_('removed')})` }]
  ];

  $: ranges = dayTitle && $dayRanges(dayTitle, isAdding ? null : editingRecord.id);


  function convertRecordForEditing() {
    if (editingRecord) {
      const copiedRecord = JSON.parse(JSON.stringify(editingRecord));

      record = {
        intervalId: copiedRecord.intervalId,
        activityId: copiedRecord.activityId,
        activityTitle: copiedRecord.activityTitle,
        comment: copiedRecord.comment,
        startTime: getHoursAndMinutesFromTimestamp(copiedRecord.startedAt),
        endTime: getHoursAndMinutesFromTimestamp(copiedRecord.finishedAt),
      };
    } else {
      resetRecord();
    }
  }

  function prefillForAdding() {
    const activitiesKeys = Object.keys($activities);

    if (activitiesKeys.length === 1) {
      record.activityId = activitiesKeys[0];
    }
  }

  function resetRecord() {
    record = {...recordTemplate};
  }

  function getRecordForSaving() {
    return {
      id: editingRecord.id,
      intervalId: record.intervalId,
      activityId: record.activityId,
      activityTitle: $activities[record.activityId] || record.activityTitle,
      comment: record.comment,
      duration: Math.ceil((endTimestamp - startTimestamp) / (1000 * 60)),
      startedAt: isTimeChanged ? startTimestamp : editingRecord.startedAt,
      finishedAt: isTimeChanged ? endTimestamp : editingRecord.finishedAt,
    };
  }

  function validate() {
    errorMessage = '';

    if (startTimestamp > endTimestamp) {
      errorMessage = $_('validation.duration_negative_error');

      return false;
    }

    if (endTimestamp > +new Date()) {
      errorMessage = $_('validation.duration_more_than_current');

      return false;
    }

    if (isRangeIntersectRanges([startTimestamp, endTimestamp], ranges)) {
      errorMessage = $_('validation.intersect_error');

      return false;
    }

    return true;
  }

  function addRecord(event) {
    event.preventDefault();

    if (validate()) {
      stat.addRecordManually(dayTitle, getRecordForSaving());

      close();
    }
  }

  function editRecord(event) {
    event.preventDefault();

    if (validate()) {
      stat.changeRecord(dayTitle, getRecordForSaving());

      close();
    };
  }

  async function removeRecord() {
    if (await askConfirmation()) {
      const day = dayTitle;
      const id = editingRecord.id;
      
      setTimeout(() => {
        stat.removeStat(day, id);
      }, 500);

      close();
    }
  }

  function close() {
    dispatch('close');
  }
</script>
<BasicModal
  active="{active}"
  on:close="{close}"
  title={$_(isAdding ? 'add_record' : 'modals.edit_record')}
>
  <form
    on:submit="{ isAdding ? addRecord : editRecord }"
    class="handle-record-modal"
  >
    <h3 class="day">{$_('day').toLowerCase()}: {dayTitle}</h3>
    <section class="section">
      <CustomSelect
        wide
        required
        label="{$_('activity')}"
        options={activitiesOptions}
        bind:value="{record.activityId}"
      />
      {#if !isAdding && !$activities[record.activityId]}
        <div class="validation-message">
          {$_('validation.deprecated_activity')}
        </div>
      {/if}
    </section>
    <section class="section">
      <CustomSelect
        wide
        required
        label="{$_('type')}"
        options="{intervalOptions}"
        bind:value={record.intervalId}
      />
    </section>
    <section class="section time">
      <div class="time-block">
        <CustomInput
          wide
          required
          type="time"
          bind:value="{record.startTime}"
          on:input={() => { isTimeChanged = true }}
          label="{$_('start_time')}"
        />
      </div>
      <div class="time-block">
        <CustomInput
          wide
          required
          type="time"
          bind:value="{record.endTime}"
          on:input={() => { isTimeChanged = true }}
          label="{$_('end_time')}"
        />
      </div>
    </section>
    <section class="section">
      <CustomInput
        wide
        readonly
        central
        pure
        value="{calculatedDuration}"
        label="{$_('duration')}"
      />
    </section>
    <section class="section">
      <CustomInput
        wide
        bind:value="{record.comment}"
        label="{$_('comment')}"
      />
    </section>
    {#if errorMessage}
      <div class="validation-message">
        {errorMessage}
      </div>
    {/if}
    <footer class="footer">
      {#if isAdding}
        <CustomButton
          on:click="{close}"
          small
        >
          {$_('cancel').toLowerCase()}
        </CustomButton>
      {:else}
        <CustomButton
          on:click="{removeRecord}"
          small
        >
          {$_('modals.delete_record').toLowerCase()}
        </CustomButton>
      {/if}
      <CustomButton
        type="submit"
        bordered
      >
        {$_('save')}
      </CustomButton>
    </footer>
  </form>
</BasicModal>

<style lang="scss">
  .handle-record-modal {
    width: 300px;
    margin: 0 auto;
    padding: 50px 15px;
    color: var(--color-text-softer);
    .day {
      text-align: left;
      color: var(--color-text-soft);
      font-size: 14px;
      margin-bottom: 15px;
    }
    .section {
      margin-bottom: 20px;
      &.time {
        display: flex;
        gap: 15px;
        justify-content: space-between;
      }
    }
    .time-block {
      flex-grow: 1;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 10px 0;
    }
    .validation-message {
      font-size: 12px;
      color: var(--color-text-softest);
      margin-bottom: 15px;
    }
  }
</style>

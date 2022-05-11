<script>
  import { _ } from 'svelte-i18n';
  import { intervalsArr } from './../../store/intervals.js';
  import { createEventDispatcher } from 'svelte';
  import BasicModal from './BasicModal.svelte';
  import TextInput from './../form-elements/TextInput.svelte';
  import DefaultSelect from './../form-elements/DefaultSelect.svelte';
  import DefaultButton from './../form-elements/DefaultButton.svelte';
  import { stat } from './../../store/statistics';
  import { activities, activityOptionsForSelect } from '../../store/activities.js';
  import { makeAbsoluteTimeString } from './../../utils.js';

  const dispatch = createEventDispatcher();
  export let record = null;
  export let nextRecord = null;
  export let recordIndex = null;
  export let dayTitle = null;

  let localRecord = {};
  let durationErrorMessage = '';

  $: makeLocalRecord(record);
  $: intervalOptions = $intervalsArr.map(item => ({ value: item[0], text: $_('interval_labels.' + item[0]) }));
  $: activitiesOptions = [
    ...$activityOptionsForSelect,
    ...$activities[record?.activityId] ? [] : [{ value: record?.activityId, text: record?.activityTitle + ` (${$_('removed')})` }]
  ];

  function makeLocalRecord() {
    localRecord = JSON.parse(JSON.stringify(record));
  }

  function validate() {
    let isValid = true;

    isValid = isDurationValid();

    return isValid;
  }

  function isDurationValid() {
    const endTime = +localRecord.duration * 60 * 1000 + localRecord.startedAt;

    if (Number.isNaN(+localRecord.duration)) {
      durationErrorMessage = 'Number is required';
      return false;
    }

    if (
      nextRecord &&
      +localRecord.duration * 60 * 1000 + localRecord.startedAt > nextRecord.startedAt
    ) {
      durationErrorMessage = 'That duration make this record intersect with the next one';
      return false;
    }

    if ((new Date(endTime)).getDate() !== (new Date(record.startedAt)).getDate()) {
      durationErrorMessage = 'There is no possibility to set end time in next day';
      return false;
    }

    if (endTime > +(new Date)) {
      durationErrorMessage = 'You couldn\'t set time more than current time';
      return false;
    }

    return true;
  }

  function changeRecord(event) {
    event.preventDefault();
    durationErrorMessage = '';

    const isValid = validate();

    if (isValid) {
      stat.changeRecord(dayTitle, recordIndex, {
        ...localRecord,
        finishedAt: +localRecord.duration * 60 * 1000 + localRecord.startedAt,
        activity: {
          id: localRecord.activityId,
          title: $activities[localRecord.activityId] || localRecord.activityTitle,
        }
      });

      close();
    };
  }

  async function removeRecord() {
    const day = dayTitle;
    const startedAt = record.startedAt;
    
    setTimeout(() => {
      stat.removeStat(day, startedAt);
    }, 500);

    close();
  }

  function recalculateTime() {
    localRecord.finishedAt = +localRecord.duration * 60 * 1000 + localRecord.startedAt;
  }

  function close() {
    durationErrorMessage = '';
    dispatch('close');
  }
</script>
{#if record}
  <BasicModal
    active="{record}"
    on:close="{close}"
    title={$_('modals.edit_record')}
  >
    <form on:submit={changeRecord} class="edit-record-modal">
      <section class="section">
        <DefaultSelect
          wide
          label="{$_('activity')}"
          options={activitiesOptions}
          bind:value={localRecord.activityId}
        />
        {#if !$activities[localRecord.activityId]}
          <div class="validation-message">
            {$_('validation.deprecated_activity')}
          </div>
        {/if}
      </section>
      <section class="section">
        <DefaultSelect
          wide
          label="{$_('type')}"
          options={intervalOptions}
          bind:value={localRecord.intervalId}
        />
      </section>
      <section class="section">
        <TextInput
          wide
          bind:value="{localRecord.duration}"
          on:input="{recalculateTime}"
          label="{$_('duration') + ` (${$_('minutes')})`}"
          errormessage="{durationErrorMessage}"
        />
      </section>
      <section class="section">
        <TextInput
          wide
          bind:value="{localRecord.comment}"
          label="{$_('comment')}"
        />
      </section>
      <section class="section">
        <div class="time">
          <div>
            {$_('started_at')}
            <span>
              {makeAbsoluteTimeString(localRecord.startedAt, true)}
            </span>
          </div>
          <div>
            {$_('finished_at')}
            <span>
              {makeAbsoluteTimeString(localRecord.finishedAt, true)}
            </span>
          </div>
        </div>
      </section>
      <footer class="footer">
        <DefaultButton
          on:click="{removeRecord}"
          small
        >
          {$_('modals.delete_record').toLowerCase()}
        </DefaultButton>
        <DefaultButton
          type="submit"
          bordered
        >
          {$_('save')}
        </DefaultButton>
      </footer>
    </form>
  </BasicModal>
{/if}

<style lang="scss">
  .edit-record-modal {
    width: 300px;
    margin: 0 auto;
    padding: 50px 15px;
    color: var(--color-text-softer);
    .section {
      margin-bottom: 20px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 10px 0;
    }
    .title {
      color: var(--color-text);
      font-size: 14px;
      text-align: center;
    }
    .validation-message {
      font-size: 12px;
      color: var(--color-text-softest);
    }
    .time {
      font-size: 14px;
      text-align: right;
      color: var(--color-text-softest);
    }
  }
</style>
<script>
  import { _ } from 'svelte-i18n';
  import {
    intervals,
    intervalsArr,
    playAudio,
    updateFactor,
  } from './../../store/intervals.js';
  import { soundsArr } from './../../store/sounds.js';
  import ExpandBlock from './../ExpandBlock.svelte';
  import CustomInput from './../form-elements/CustomInput.svelte';
  import CustomSelect from './../form-elements/CustomSelect.svelte';
  import CustomButton from './../form-elements/CustomButton.svelte';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';

  let isIntervalSettingsExpand = true;

  function changeDuration(intervalId, value, isRound = true) {
    const correctValue = +value
      ? isRound
        ? Math.ceil(value)
        : value
      : 1;

    intervals.changeIntervalProp(intervalId, 'duration', correctValue);
    updateFactor();
  }
</script>

<div class="interval-settings">
  <div class="interval-setting-wrapper">
    {#each $intervalsArr as [intervalId, options]}
      <div class="interval-settings">
        <div class="settings-subtitle">{$_(options.label)}</div>
      </div>
    {/each}
  </div>
  <ExpandBlock
    withBorder
    thin
    title="{$_('duration')}"
    active="{isIntervalSettingsExpand}"
  >
    <div class="interval-setting-wrapper">
      {#each $intervalsArr as [intervalId, options]}
        <div class="interval-settings">
          <CustomInput
            big
            center
            wide
            type="number"
            optionalProps="{
              {
                min: "1",
                max: "100",
                step: "1",
              }
            }"
            value="{options.duration}"
            on:change="{value => {
              changeDuration(intervalId, value.detail);
            }}"
          />
        </div>
      {/each}
    </div>
  </ExpandBlock>
  <ExpandBlock
    withBorder
    thin
    title="{$_('settings.title_interval')}"
    active="{isIntervalSettingsExpand}"
  >
    <div class="interval-setting-wrapper">
      {#each $intervalsArr as [intervalId, options]}
        <div class="interval-settings">
          <CustomInput
            big
            center
            wide
            type="text"
            value="{options.title}"
            on:input="{event => {
              intervals.changeIntervalProp(intervalId, 'title', event.detail);
            }}"
          />
        </div>
      {/each}
    </div>
  </ExpandBlock>
  <ExpandBlock
    withBorder
    thin
    title="{$_('sound')}"
    active="{isIntervalSettingsExpand}"
  >
    <div class="interval-setting-wrapper">
      {#each $intervalsArr as [intervalId, options]}
        <div class="interval-settings">
          <CustomInput
            type="range"
            optionalProps="{
              {
                min: "0",
                max: "1",
                step: ".01",
              }
            }"
            value="{options.sound.volume}"
            on:input="{event => {
              intervals.changeSound(intervalId, {
                volume: event.detail,
              });
            }}"
          />
          <CustomSelect
            wide
            options="{$soundsArr.map(item => ({
              value: item.id,
              text: $_(item.title),
            }))}"
            value="{options.sound.id}"
            on:change="{event => {
              intervals.changeSound(intervalId, {
                id: event.detail,
              });
            }}"
          />
          <CustomButton
            on:click="{playAudio(intervalId)}"
            small
          >
            {$_('play')}
          </CustomButton>
        </div>
      {/each}
  </ExpandBlock>
  <ExpandBlock
    withBorder
    thin
    title="{$_('use')}"
    active="{isIntervalSettingsExpand}"
  >
    <div class="interval-setting-wrapper">
      {#each $intervalsArr as [intervalId, options]}
        <div class="interval-settings">
          {#if intervalId !== 'main'}
              <div class="checkbox-setting">
                <CustomCheckbox
                  checked="{options.isActive}"
                  on:change="{event => {
                    intervals.changeIntervalProp(intervalId, 'isActive', +event.detail);
                  }}"
                />
              </div>
            {/if}
        </div>
      {/each}
    </div>
  </ExpandBlock>
</div>

<style lang="scss">
  .interval-settings {
    .interval-setting-wrapper {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 15px;
    }
    .interval-settings {
      flex-grow: 1;
      max-width: 30%;
      text-align: center;
    }
  }
</style>

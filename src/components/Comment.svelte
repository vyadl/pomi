<script>
  import { slide } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import { comment } from './../store/counter.js';
  import { currentInterval } from './../store/intervals.js';
  import CustomInput from './form-elements/CustomInput.svelte';
  import CustomButton from './form-elements/CustomButton.svelte';

  let showComment = false;
</script>

<div class="comment">
  {#if $currentInterval}
    <div
      class="top-line"
      class:active="{$currentInterval}"
    >
      <CustomButton
        on:click="{() => {
          showComment = !showComment;
        }}"
      >
        {$_('comment_for_period')}
      </CustomButton>
    </div>
    {#if showComment}
      <div class="input-wrap" transition:slide>
        <CustomInput
          on:input="{({ detail }) => {
            comment.set(detail);
          }}"
          value="{$comment}"
          wide
        />
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .comment {
    margin-bottom: 15px;
    min-height: 40px;
    .top-line {
      font-size: 12px;
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>

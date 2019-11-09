<script>
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';

    // Input
    export let questionText;
    export let possibleAnswers; // id, text
    export let highlightedAnswerId = null;
    // Input/Output
    export let visible = false;

    const dispatch = createEventDispatcher();
</script>

{#if visible}
<div
    transition:scale
    class="flex bg-white gray tc h-100 justify-center flex-column"
    style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000;">
    <h1 class="f3">{questionText}</h1>
    <ul class="list pl0 ml0 center mw7 ba b--light-silver">
        {#each possibleAnswers as possibleAnswer}
            <li class="bb b--light-silver {highlightedAnswerId === possibleAnswer.id ? 'bg-near-white' : ''}">
                <a
                    href="#0"
                    class="w-100 pv3 ph4 f5 link dim dib {highlightedAnswerId === possibleAnswer.id ? 'gray b' : 'gray'}"
                    on:click={() => {
                        visible = false;
                        dispatch('answerSelected', {
                            selectedAnswerId: possibleAnswer.id
                        });
                    }}>{possibleAnswer.text}</a>
            </li>
        {/each}
        <li class="pv3 ph4 b--light-silver">
            <a href="#0" class="b f5 link dim dib gray" on:click={() => visible = false}>Cancel</a>
        </li>
    </ul>
</div>
{/if}
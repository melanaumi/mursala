<template>
  <div class="card" id="app">
    <drag-drop
        :dropzones="dropGroups"
        :dropzonesTitle="'XYZ Company Teams'"
        :originalData="stories"
        :originalTitle="'Tasks to be distributed'"
        :inPlace="true"
        :enableSave="true"
        :enableCancel="true"
        @dropInOriginalBucket="originalBucketDropEvent"
        @dropInDestinationBucket="destinationBucketDropEvent"
        @save="save"
        @cancel="cancel"
    >
      <template #dd-card="{ cardData }">
        <custom-card
            :data="cardData"
            @done="doneMarked"
        />
      </template>
    </drag-drop>
  </div>
</template>

<script>
import DragDrop from 'vue-drag-n-drop'

export default {
  name: "drag-drop",
  components: {
    DragDrop
  },
  data() {
    return {
      stories: [
        {
          title: 'Strategy 101',
          description: 'Create a draft of business plan',
          time: '3 days',
          done: false
        },
        {
          title: 'Strategy 102',
          description: 'Finalize the plan',
          time: '4 days',
          done: false
        },
        {
          title: 'Tech diagram',
          description: 'Draw the tech data',
          time: '4 days',
          done: false
        },
        {
          title: 'Place Holder',
          description: 'Data Science Team',
          time: '5 days',
          done: false
        }
      ],

      dropGroups: [
        {
          name: 'Business Team',
          children: []
        },
        {
          name: 'Tech Dept',
          children: []
        },
        {
          name: 'Marketing Dept',
          children: []
        }
      ]
    }
  },
}
</script>
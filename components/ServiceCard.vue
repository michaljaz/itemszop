<template>
  <v-card elevation="5" height="100%" :to="link">
    <center>
      <template v-if="service.icon">
        <v-img :src="service.iconUrl" max-height="120" contain />
      </template>
      <template v-else>
        <v-img src="/item.png" max-height="120" contain />
      </template>
    </center>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" md="6" class="pb-0">
          SMS
        </v-col>
        <v-col cols="12" xs="6" md="6" class="text-right pb-0">
          <template v-if="service.sms">
            {{ smsCost[service.smsType] }} zł
          </template>
          <template v-else>
            X
          </template>
        </v-col>
        <v-col cols="12" xs="6" md="6" class="pt-1">
          Przelew
        </v-col>
        <v-col cols="12" xs="6" md="6" class="text-right pt-1">
          <template v-if="service.przelew">
            {{ service.przelewCost }} zł
          </template>
          <template v-else>
            X
          </template>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="mx-4" />
    <v-card-title class="justify-center">
      {{ service.name }}
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  name: 'ServiceCard',
  props: {
    service: {
      type: Object,
      required: true
    },
    link: {
      type: String,
      default: () => ('')
    }
  },
  data () {
    return {
      smsCost: {
        1: '1.23',
        2: '2.46',
        3: '3.69',
        4: '4.92',
        5: '6.15',
        6: '7.38',
        7: '11.07',
        8: '17.22',
        9: '23.37',
        10: '24.60',
        11: '30.75'
      }
    }
  }
}
</script>

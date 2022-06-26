<template>
  <ClientOnly>
    <!-- Use the component in the right place of the template -->
    <tiptap-vuetify v-model="content" :extensions="extensions" :toolbar-attributes="toolbarAttrs" />

    <template #placeholder>
      Loading...
    </template>
  </ClientOnly>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from 'tiptap-vuetify'
export default {
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  props: {
    editorcontent: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    // declare extensions you want to use
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3]
            }
          }
        ],
        Bold,
        Link,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ],
      // starting editor's content
      content: this.editorcontent
    }
  },
  computed: {
    toolbarAttrs () {
      return this.$vuetify.theme.isDark
        ? { color: 'black', dark: true }
        : { color: 'primary' }
    }
  },
  watch: {
    editorcontent () {
      this.content = this.editorcontent
    },
    content () {
      this.$emit('content', this.content)
    }
  }
}
</script>

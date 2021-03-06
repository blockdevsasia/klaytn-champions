import { firebaseAuth } from 'boot/firebase'

export default {
  handler: () => {
  },

  async logout (ctx) {
    console.log('user/logout')
    firebaseAuth.signOut()
  },

  async init (ctx) {
    console.log('user/init')
  },

  async loggedIn (ctx, firebaseUser) {
    const user = {
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      photoUrl: firebaseUser.photoURL
    }
    console.log('loggedIn', user)

    ctx.commit('current', user)

    ctx.dispatch('openDBChannel', { uid: firebaseUser.uid })
  },

  setUserField (ctx, change) {
    ctx.dispatch('set', change)
  },

  async reset (ctx) {
    console.log('user/reset')

    firebaseAuth.signOut()

    await ctx.dispatch('closeDBChannel', { clearModule: true })
    ctx.commit('current', {})
  },

  async resetAll (ctx) {
    console.log('resetting all')
    // Reset contract
    console.log(ctx.getters.address)
    await ctx.dispatch('external/httpResetUser', ctx.getters.address, { root: true })

    // Reset firebase
    ctx.dispatch('set', {
      address: '',
      selectedLevel: '1',
      level2solution: '',
      level3solution: '',
      level4solution: '',
      level5solution: ''
    })
    ctx.commit('user/level', 1, { root: true })
    ctx.commit('user/random', 0, { root: true })
  }

}

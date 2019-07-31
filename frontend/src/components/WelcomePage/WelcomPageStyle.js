import { colors, globalCard,  } from '../Styles'
export { styles }

const styles = theme => ({
    card: globalCard,
    link: {
        color: colors.secundary
    },
    text: {
        fontWeight: 'normal',
        color: colors.text,
        textAlign: 'center'
    }
});
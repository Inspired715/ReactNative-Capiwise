import{ Dimensions, StyleSheet } from 'react-native';
export const globalStyle = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "#040B11",
        paddingBottom:20
    },
    container: {
        width: "100%",
        backgroundColor: "#040B11",
        paddingHorizontal: 15
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
    },
    heading: {
        color: "#FFF",
        fontFamily: "Roboto",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing:0.2
   },
    tabHeader: {
        backgroundColor:'#040B11', 
        paddingHorizontal:15,
        marginTop:-15
    },
    tabLabel: {
        letterSpacing:0.2,
        fontSize:17,
        borderBottomColor:'#2EBD85', 
        paddingBottom:5
    },
    flexRow:{
        flexDirection:'row'
    },
    flexColumn:{
        flexDirection:'column'
    },
    alignItemsCenter:{
        flexDirection:'row',
        alignItems:'center'
    },
    justifyCenter: {
        justifyContent:'center',
        flexDirection:'row'
    },
    justifyBetween: {
        justifyContent:'space-between',
        flexDirection:'row'
    },
    justifyEvenly:{
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    h1:{
        color: "#FFF",
        fontFamily: "Roboto",
        fontWeight:'700',
        letterSpacing:0.2,
        fontSize: 24,
    },
    h2:{
        color: "#979797",
        fontFamily: "Roboto",
        fontWeight:'400',
        letterSpacing:1,
        fontSize: 12,
    },
    h3:{
        color: "#979797",
        fontFamily: "Roboto",
        fontWeight:'700',
        letterSpacing:0.1,
        fontSize: 12,
    },
    h4:{
        color: "#FFF",
        fontFamily: "Roboto",
        fontWeight:'400',
        letterSpacing:0.2,
        fontSize: 17,
    },
    h5:{
        color: "#FFF",
        fontFamily: "Roboto",
        fontWeight:'700',
        letterSpacing:0.2,
        fontSize: 17,
    },
    h6:{
        color: "#FFF",
        fontFamily: "Roboto",
        fontSize: 17,
        fontWeight: "500",
        letterSpacing:0.2
    },
    divider: {
        marginTop: 25,
        height: 8,
        backgroundColor: "#0B1620",
        width:'100%'
    },
    newsImageSize:{
        height: 74,
        width: 140,
        borderRadius: 5,
    },
    newsTitle:{
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.28
    },
    newssubTitle:{
        color: "#FFF",
        fontSize: 10,
        fontWeight: "500",
        marginTop: 3,
    },
    newsTimeline:{
        color: "#FFF",
        fontSize: 8,
        fontWeight: "700",
        textAlign: "left",
        letterSpacing:0.3,
    },
    shareIcon:{
        backgroundColor:'#0B1620', 
        width:30, 
        height:30, 
        borderRadius:30, 
        justifyContent:'center', 
        alignItems:'center', 
        paddingRight:3
    }
})
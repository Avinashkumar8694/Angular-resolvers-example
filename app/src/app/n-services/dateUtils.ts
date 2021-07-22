import * as moment from 'moment';
export class dateUtils {
    constructor() {

    }
    async parseAction(action, date, dateFormat, parseObject, parseDateArray, parseDateObject, timestamps, locale?){
        let option = {
            "ParseString" : [date, dateFormat, locale],
            "ParseObject" : [parseObject],
            "ParseDate"  : [parseDateObject],
            "ParseArray" : [parseDateArray],
            "UTCParseString" : [date],                  
            "UTCParseDate" : [parseDateObject] 
        }
        if(action == 'Unixtimestamp'){
           return moment.unix(timestamps);
        }
        else if(action == 'UTCParseString' || action =='UTCParseDate'){
           return moment.utc(...option[action]);            
        }else{
           return moment(...option[action]);
        }
    }

    async dateAction(action, unitsValue, units, inputReference?, objectLiteral?){
        if(action =='local' || action == 'utc'){
            if(moment.isMoment(inputReference))
                return inputReference[action]();
            else
            return moment([inputReference])[action]();
        }else if(action == 'add' || action == 'subtract'){
            if(!objectLiteral){
                if(moment.isMoment(inputReference))
                    return inputReference[action](unitsValue, units);
                else
                    return moment(inputReference)[action](unitsValue, units);
            }
            if(moment.isMoment(inputReference))
                return inputReference[action](objectLiteral);
            else
                return moment(inputReference)[action](objectLiteral)
        }
        else {
            if(moment.isMoment(inputReference))
                return inputReference[action](units);
            else
                return moment(inputReference)[action](units);
        }
    }
  
    async formatAction(action, units, unitsformat, froms, to, inputReference?){
             
        if(action == 'toDate' || action == 'toArray' || action == 'toJSON' || action == 'toObject' || action == 'toString'){
            if(moment.isMoment(inputReference))
                return inputReference[action]();
            return moment([inputReference])[action]();
        }
        else if(action =='fromNow' || action == 'toNow' || action == 'valueOf' || action =='unix'){
            if(moment.isMoment(inputReference))
                return inputReference[action]();
            return moment(inputReference)[action]();
        }else if(action == 'from' || action =='to')
        {
            if(moment.isMoment(to))
            return moment([froms])[action]([to]);
            else
            return moment([froms])[action](moment([to]));
        }else if(action == 'diff')
        {
            if(moment.isMoment(to) && moment.isMoment(froms))
            return froms[action](to,units);
            else
            return moment(froms)[action](moment(to),units);
        }
        else{
            if(moment.isMoment(inputReference))
                return inputReference.format(unitsformat);
           else
                return moment([inputReference]).format(unitsformat);
        }
    }
    async validateAction(action, inputReference, froms, to, units, isBetween){
        if(action == 'isMoment' || action == 'isDate' || action=='isDuration'){
           return moment[action](inputReference)
        }
        else if(action == 'isLeapYear' || action == 'isDST'){
           return moment([inputReference])[action]();
        }else if(action == 'isBetween'){
            return moment(isBetween).isBetween(froms, to, units)
        }else{
            return moment(froms)[action](to, units)
        }
    }
    async durationAction(action, unitsValue, units, inputReference, objectLiteral?){
        
        if(action =='as' || action == 'get') {
            return moment.duration(unitsValue, units)[action](units);
        }
        if(action =='create'){
            if(typeof objectLiteral =='object'){
                return moment.duration(objectLiteral)
            }
            return moment.duration(unitsValue, units);
        }
        else{
            return inputReference.clone()
        }
    }
    async getSetAction(action, unit, unitValue, inputReference1,inputReference2, inputReference?, objects?){
        
        if(action =='get'){
            if(moment.isMoment(inputReference))
                return inputReference.get(unit);
            else
                return moment(inputReference).get(unit);
        }
        else if(action == 'set'){
            if(typeof objects =='object')
                if(moment.isMoment(inputReference))
                    return inputReference.set(objects);
                else
                    return moment(inputReference).set(objects)
            
            else{
                if(moment.isMoment(inputReference))
                    return inputReference.set(unit, unitValue);
                else
                    return moment(inputReference).set(unit, unitValue);
            }
        }
        else{
            return moment[action](inputReference1, inputReference2);
        }    
    }
}
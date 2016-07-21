var roleBuilder = {
    /** @param {Creep} creep **/
    init: function(creep) {
        creep.memory.targetIndex = creep.room.getUnderworkedSource();
        creep.room.memory.sources[creep.memory.targetIndex].workerCount++;
        creep.memory.building = false;
        console.log('[' + creep.name + '] Let\'s get building!');
    },
    
    /** @param {Creep} creep **/
    cleanup: function(creep) {
        if (creep.memory.targetIndex !== undefined) {
            creep.room.memory.sources[creep.memory.targetIndex].workerCount--;
            creep.memory.targetIndex = undefined;
        }
        creep.memory.building = undefined;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            // Finished task
            return false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            let result = creep.build(sites[0]);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0]);
            } else if (result < 0) { // Not ok, cancel construction.
                return false;
            }
        } else {
            if (creep.memory.targetIndex === undefined) return false; // Should have target, but if not let's cancel task.
            var source = Game.getObjectById(creep.room.memory.sources[creep.memory.targetIndex].id);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        return true;
    }
};

module.exports = roleBuilder;

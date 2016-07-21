var roleUpgrader = {
    /** @param {Creep} creep **/
    init: function(creep) {
        creep.memory.targetIndex = creep.room.getUnderworkedSource();
        creep.room.memory.sources[creep.memory.targetIndex].workerCount++;
        creep.memory.upgrading = false;
        console.log('[' + creep.name + '] Hmmm... Upgrades.');
    },
    
    /** @param {Creep} creep **/
    cleanup: function(creep) {
        if (creep.memory.targetIndex !== undefined) {
            creep.room.memory.sources[creep.memory.targetIndex].workerCount--;
            creep.memory.targetIndex = undefined;
        }
        creep.memory.upgrading = undefined;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            // Finished task
            return false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if (creep.memory.targetIndex === undefined) return false; // Should have target, but if not let's cancel task.
            var source = Game.getObjectById(creep.room.memory.sources[creep.memory.targetIndex].id);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        return true;
    }
};

module.exports = roleUpgrader;

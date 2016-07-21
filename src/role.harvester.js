var roleHarvester = {
    /** @param {Creep} creep **/
    init: function(creep) {
        if (!creep.room.memory.sourceWorkers) {
            creep.room.memory.sourceWorkers = new Array(creep.room.memory.sources.length);
            for (var i = 0; i < creep.room.memory.sourceWorkers.length; i++) {
                creep.room.memory.sourceWorkers[i] = 0;
            }
        }
        creep.memory.targetIndex = undefined;
        for (var i = 0; i < creep.room.memory.sourceWorkers.length; i++) {
            if (creep.memory.targetIndex === undefined || creep.room.memory.sourceWorkers[i] < creep.room.memory.sourceWorkers[creep.memory.targetIndex]) {
                creep.memory.targetIndex = i;
            }
        }
        creep.room.memory.sourceWorkers[creep.memory.targetIndex]++;
        console.log('[' + creep.name + '] Power overwhelming.');
    },
    
    /** @param {Creep} creep **/
    cleanup: function(creep) {
        if (creep.memory.targetIndex !== undefined) {
            creep.room.memory.sourceWorkers[creep.memory.targetIndex]--;
            creep.memory.targetIndex = undefined;
        }
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var source = Game.getObjectById(creep.room.memory.sources[creep.memory.targetIndex]);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                } else {
                    return false;
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN);
                        }
                });
                if (targets.length > 0) {
                    var home = targets[0];
                    var dx = creep.pos.x - home.pos.x;
                    var dy = creep.pos.y - home.pos.y;
                    var distanceSq = dx * dx + dy * dy;
                    if (distanceSq > 2) {
                        creep.moveTo(home);
                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
    }
};

module.exports = roleHarvester;

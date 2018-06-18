let assert = require('chai').assert;
let redis = require('./');


describe('Test redis+bluebird', function() {
    let client = null;
    const GLOBAL_PREFIX = '';
    const GLOBAL_POSTFIX = '';

    function transform(value) {
        return GLOBAL_PREFIX + value + GLOBAL_POSTFIX;
    }

    before(async function() {
        redis.connect();
        client = redis.getClient();
        await client.delAsync(HKEY, LKEY, SKEY);
    });
    //


    //-----------------------------------------//
    //---------/   SIMPLE KEY    /------------//
    //---------------------------------------//

    const KEY = transform('KEY');
    const VALUE = transform('VALUE');

    describe("#setAsync('" + KEY + "','" + VALUE + "')", function () {
        it("should return 'OK'", async function () {
            assert.equal(await client.setAsync(KEY, VALUE), 'OK');
        });
    });

    describe("#getAsync('" + KEY + "')", function () {
        it("should return '" + VALUE +"'", async function () {
            assert.equal(await client.getAsync(KEY), VALUE);
        });
    });

    describe("#delAsync('" + KEY + "')", function () {
        it("should return " + 1 +"", async function () {
            assert.equal(await client.delAsync(KEY), 1);
        });
        it("(recall) should return " + 0 +"", async function () {
            assert.equal(await client.delAsync(KEY), 0);
        });
    });

    describe("#getAsync('" + KEY + "')", function () {
        it("should return " + null + "", async function () {
            assert.equal(await client.getAsync(KEY), null);
        });
    });


    //------------------------------------------//
    //---------/   HKEY (HASH)    /------------//
    //----------------------------------------//

    const HKEY = transform('HKEY');
    const FIELD_1 = transform('FIELD_1');
    const VALUE_1 = transform('VALUE_1');
    const FIELD_2 = transform('FIELD_2');
    const VALUE_2 = transform('VALUE_2');
    const FIELD_3 = transform('FIELD_3');

    describe("#hsetAsync(...[" + [HKEY, FIELD_1, VALUE_1] + "])",function () {
        it("should return 1", async function () {
            assert.equal(await client.hsetAsync(...[HKEY, FIELD_1, VALUE_1]), 1);
        });
        it("(recall) should return 0", async function () {
            assert.equal(await client.hsetAsync(...[HKEY, FIELD_1, VALUE_1]), 0);
        });
    });

    describe("#hgetAsync('"+HKEY+"', '"+FIELD_1+"')",function () {
        it("should return '" + VALUE_1 + "'", async function () {
            assert.equal(await client.hgetAsync(HKEY, FIELD_1), VALUE_1);
        });
    });

    describe("#hdelAsync('"+HKEY+"', '"+FIELD_1+"')",function () {
        it("should return 1", async function () {
            assert.equal(await client.hdelAsync(HKEY, FIELD_1), 1);
        });
        it("(recall)should return 0", async function () {
            assert.equal(await client.hdelAsync(HKEY, FIELD_1), 0);
        });
    });

    describe("#hgetAsync('"+HKEY+"', '"+FIELD_1+"')",function () {
        it("should return null", async function () {
            assert.equal(await client.hgetAsync(HKEY, FIELD_1), null);
        });
    });

    describe("#hmsetAsync(...["+[HKEY, FIELD_1, VALUE_1, FIELD_2, VALUE_2]+"])",function () {
        it("should return 'OK'", async function () {
            assert.equal(await client.hmsetAsync(HKEY, FIELD_1, VALUE_1, FIELD_2, VALUE_2), 'OK');
        });
    });

    describe("#hmgetAsync('"+HKEY+"', ...FIELDS)",function () {
        it("(FIELDS=["+[FIELD_1]+"]) should return ["+[VALUE_1]+"]", async function () {
            const RESPONSE = await client.hmgetAsync(HKEY, FIELD_1);
            assert.deepEqual(RESPONSE, [VALUE_1]);
        });
        it("(FIELDS=["+[FIELD_1, FIELD_2]+"]) should return ["+[VALUE_1, VALUE_2]+"]", async function () {
            const RESPONSE = await client.hmgetAsync(HKEY, FIELD_1, FIELD_2);
            assert.deepEqual(RESPONSE, [VALUE_1, VALUE_2]);
        });
        it("(FIELDS=["+[FIELD_2, FIELD_1]+"]) should return ["+[VALUE_2, VALUE_1]+"]", async function () {
            const RESPONSE = await client.hmgetAsync(HKEY, FIELD_2, FIELD_1);
            assert.deepEqual(RESPONSE, [VALUE_2, VALUE_1]);
        });
        it("(FIELDS=["+[FIELD_1, FIELD_2, FIELD_3]+"]) should return [VALUE_1, VALUE_2, null]", async function () {
            const RESPONSE = await client.hmgetAsync(HKEY, FIELD_1, FIELD_2, FIELD_3);
            assert.deepEqual(RESPONSE, [VALUE_1, VALUE_2, null]);
        });
    });

    describe("#hgetallAsync('"+HKEY+"')",function () {
        it("should return {FIELD_1:VALUE_1, FIELD_2:VALUE_2}", async function () {
            assert.deepEqual(await client.hgetallAsync(HKEY), {FIELD_1:VALUE_1, FIELD_2:VALUE_2});
        });
    });


    //----------------------------------------------//
    //---------/    LKEY (LIST)     /--------------//
    //--------------------------------------------//

    const LKEY = transform('LKEY');
    const VALUE_3 = transform('VALUE_3');

    describe("#lpushAsync('"+LKEY+"', VALUE)",function () {
        it("(VALUE = '"+VALUE_1+"') should return 1", async function () {
            assert.equal(await client.lpushAsync(LKEY,VALUE_1), 1);
        });
        it("(VALUE = '"+VALUE_2+"') should return 2", async function () {
            assert.equal(await client.lpushAsync(LKEY,VALUE_2), 2);
        });
        it("(VALUE = '"+VALUE_3+"') should return 3", async function () {
            assert.equal(await client.lpushAsync(LKEY,VALUE_3), 3);
        });
    });

    describe("#lrangeAsync('"+LKEY+"', FROM, TO)",function () {
        it("(FROM=0, TO=-1) should return ["+[VALUE_3, VALUE_2, VALUE_1]+"]", async function () {
            assert.deepEqual(await client.lrangeAsync(LKEY, 0, -1), [VALUE_3, VALUE_2, VALUE_1]);
        });

        it("(FROM=-1, TO=0) should return []", async function () {
            assert.deepEqual(await client.lrangeAsync(LKEY, -1, 0), []);
        });

        it("(FROM=0, TO=0) should return ['"+VALUE_3+"']", async function () {
            assert.deepEqual(await client.lrangeAsync(LKEY, 0, 0), [VALUE_3]);
        });

    });

    describe("#llenAsync('"+LKEY+"')",function () {
        it("should return 3", async function () {
            assert.equal(await client.llenAsync(LKEY), 3);
        });
    });

    describe("#lremAsync('"+LKEY+"', 0,'"+VALUE_2+"')",function () {
        it("should return 1", async function () {
            assert.equal(await client.lremAsync(LKEY,0,VALUE_2), 1);
        });
        it("(recall)should return 0", async function () {
            assert.equal(await client.lremAsync(LKEY,0,VALUE_2), 0);
        });
    });

    describe("#lrangeAsync('"+LKEY+"', FROM, TO)",function () {
        it("(FROM=0, TO=-1) should return ["+[VALUE_3, VALUE_1]+"]", async function () {
            assert.deepEqual(await client.lrangeAsync(LKEY, 0, -1), [VALUE_3, VALUE_1]);
        });
    });

    describe("#lrangeAsync('"+LKEY+"', FROM, TO)",function () {
        it("(FROM=0, TO=-1) should return ["+[VALUE_3, VALUE_1]+"]", async function () {
            assert.deepEqual(await client.lrangeAsync(LKEY, 0, -1), [VALUE_3, VALUE_1]);
        });
    });


    //----------------------------------------------//
    //---------/    SKEY (SETS)     /--------------//
    //--------------------------------------------//

    const SKEY = transform('SKEY');

    describe("#scardAsync('"+SKEY+"')",function () {
        it("should return 0", async function () {
            assert.equal(await client.scardAsync(SKEY), 0);
        });
    });

    describe("#saddAsync('"+SKEY+"', ...VALUES)",function () {
        it("(VALUES = ["+[VALUE_1]+"]) should return 1", async function () {
            assert.equal(await client.saddAsync(SKEY, VALUE_1), 1);
        });
        it("(VALUES = ["+[VALUE_2, VALUE_3]+"]) should return 2", async function () {
            assert.equal(await client.saddAsync(SKEY, ...[VALUE_2, VALUE_3]), 2);
        });
    });

    describe("#scardAsync('"+SKEY+"')",function () {
        it("should return 3", async function () {
            assert.equal(await client.scardAsync(SKEY), 3);
        });
    });

    describe("#smembersAsync('"+SKEY+"')",function () {
        const RES_VALUE = [VALUE_1, VALUE_2, VALUE_3];
        it("should include ["+RES_VALUE+"]", async function () {
            const RESULT = await client.smembersAsync(SKEY);
            assert.sameMembers(RESULT, RES_VALUE);
        });
    });

    describe("#sremAsync('"+SKEY+"')",function () {
        it("should return 1", async function () {
            assert.equal(await client.sremAsync(SKEY, VALUE_2), 1);
        });
        it("should return 0", async function () {
            assert.equal(await client.sremAsync(SKEY, VALUE_2), 0);
        });
    });

    describe("#sismemberAsync('"+SKEY+"', VALUE)",function () {
        it("(VALUE='"+VALUE_1+"') should return 1", async function () {
            assert.equal(await client.sismemberAsync(SKEY, VALUE_1), 1);
        });
        it("should return 0", async function () {
            assert.equal(await client.sismemberAsync(SKEY, VALUE_2), 0);
        });
    });

});